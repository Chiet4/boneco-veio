// src/hooks/useProdutoForm.js
import { useState, useEffect } from "react";
import { uploadImage } from "../../../services/cloudinary";

/**
 * Hook personalizado para controle do formulário de produto.
 * Compatível com os DTOs do backend (create/update).
 */
export function useProdutoForm({
  initialData,
  modoEdicao = false,
  onSubmitCallback,
}) {
  // Estado do formulário (mantém os mesmos nomes que seu form já usa)
  const [dadosFormulario, setDadosFormulario] = useState({
    imagemArquivo: null,
    imagemUrl: "",
    titulo: "",
    descricao: "",
    preco: "",
    desconto: "",
    ehNovo: false,
    favorito: false, // apenas UI; NÃO será enviado ao backend admin
    nota: 0,
    estoque: "",     // opcional p/ admin (stock)
  });

  const [previewImagem, setPreviewImagem] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mensagemFeedback, setMensagemFeedback] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Pré-preenche os campos quando em edição
  useEffect(() => {
    if (initialData) {
      setDadosFormulario({
        imagemArquivo: null,
        imagemUrl: initialData.imageSrc || "",
        titulo: initialData.title || "",
        descricao: initialData.description || "",
        preco: initialData.originalPrice ?? "",
        desconto:
          initialData.discount === null || initialData.discount === undefined
            ? ""
            : initialData.discount,
        ehNovo: initialData.isNew === true,
        favorito: initialData.isFavorite === true, // não enviaremos isso
        nota: initialData.rating ?? 0,
        estoque:
          typeof initialData.stock === "number" ? String(initialData.stock) : "",
      });

      setPreviewImagem(initialData?.imageSrc || null);
    }
  }, [initialData]);

  const lidarComMudanca = (evento) => {
    const { name, value, type, checked, files } = evento.target;
    const novoValor =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;

    if (type === "file" && files?.[0]) {
      setPreviewImagem(URL.createObjectURL(files[0]));
    }

    setDadosFormulario((anterior) => ({ ...anterior, [name]: novoValor }));
  };

  const calcularPrecoComDesconto = () => {
    const precoNumerico = parseFloat(dadosFormulario.preco);
    const descontoNumerico = parseFloat(dadosFormulario.desconto);

    if (isNaN(precoNumerico)) return "-";
    if (isNaN(descontoNumerico))
      return `R$ ${precoNumerico.toFixed(2).replace(".", ",")}`;

    const precoFinal = precoNumerico - (precoNumerico * descontoNumerico) / 100;
    return `R$ ${precoFinal.toFixed(2).replace(".", ",")}`;
  };

  // Helpers para montar payloads compatíveis com o Zod do backend
  function buildCreatePayload({ imageSrc }) {
    const originalPriceNum = parseFloat(dadosFormulario.preco);
    const discountRaw = dadosFormulario.desconto;
    const discountNum =
      discountRaw === "" || discountRaw === null
        ? undefined
        : Number(parseFloat(discountRaw).toFixed(2));

    const stockRaw = dadosFormulario.estoque;
    const stockNum =
      stockRaw === "" || stockRaw === null ? undefined : parseInt(stockRaw, 10);

    return {
      imageSrc,
      title: dadosFormulario.titulo.trim(),
      description: dadosFormulario.descricao.trim(),
      originalPrice: Number(originalPriceNum.toFixed(2)),
      ...(discountNum !== undefined ? { discount: discountNum } : {}),
      isNew: Boolean(dadosFormulario.ehNovo),
      rating: Number(dadosFormulario.nota || 0),
      ...(typeof stockNum === "number" && !isNaN(stockNum) ? { stock: stockNum } : {}),
      // NÃO enviar: price (back calcula), isFavorite (é por usuário)
    };
  }

  function buildUpdatePatch({ includeImageSrc }) {
    const patch = {};

    if (includeImageSrc && dadosFormulario.imagemUrl?.trim()) {
      patch.imageSrc = dadosFormulario.imagemUrl.trim();
    }

    if (dadosFormulario.titulo?.trim()) patch.title = dadosFormulario.titulo.trim();
    if (dadosFormulario.descricao?.trim())
      patch.description = dadosFormulario.descricao.trim();

    // originalPrice / discount
    if (dadosFormulario.preco !== "") {
      const op = parseFloat(dadosFormulario.preco);
      if (!isNaN(op)) patch.originalPrice = Number(op.toFixed(2));
    }

    if (dadosFormulario.desconto !== "") {
      const d = parseFloat(dadosFormulario.desconto);
      patch.discount = isNaN(d) ? null : Number(d.toFixed(2));
    }

    patch.isNew = Boolean(dadosFormulario.ehNovo);

    const nota = Number(dadosFormulario.nota || 0);
    if (!isNaN(nota)) patch.rating = nota;

    if (dadosFormulario.estoque !== "") {
      const s = parseInt(dadosFormulario.estoque, 10);
      if (!isNaN(s)) patch.stock = s;
    }

    return patch;
  }

  const enviarFormulario = async (aoEnviar) => {
    setEnviando(true);
    try {
      // Validações principais (alinhadas ao DTO)
      const tituloOK = Boolean(dadosFormulario.titulo?.trim());
      const descricaoOK = Boolean(dadosFormulario.descricao?.trim());
      const precoVal = parseFloat(dadosFormulario.preco);
      const precoOK = !isNaN(precoVal) && precoVal >= 0;

      const descontoVal =
        dadosFormulario.desconto === "" ? null : parseFloat(dadosFormulario.desconto);
      const descontoOK =
        descontoVal === null ||
        (!isNaN(descontoVal) && descontoVal >= 0 && descontoVal <= 100);

      if (!tituloOK || !descricaoOK || !precoOK || !descontoOK) {
        throw new Error(
          "Preencha título, descrição, preço e desconto (0–100) corretamente."
        );
      }

      let payload;

      if (!modoEdicao) {
        // Cadastro → exige upload de arquivo e obtém URL
        const arquivo = dadosFormulario.imagemArquivo;
        const arquivoOK = arquivo && /\.(jpe?g|png|webp)$/i.test(arquivo.name);
        if (!arquivoOK) {
          throw new Error(
            "Adicione uma imagem válida (.jpg, .jpeg, .png ou .webp)."
          );
        }
        const imageSrc = await uploadImage(arquivo);
        payload = buildCreatePayload({ imageSrc });
      } else {
        // Edição → patch parcial; inclui imageSrc se o usuário digitou uma nova URL
        const includeImageSrc = Boolean(dadosFormulario.imagemUrl?.trim());
        payload = buildUpdatePatch({ includeImageSrc });
      }

      await aoEnviar(payload);

      if (typeof onSubmitCallback === "function") {
        onSubmitCallback(
          modoEdicao ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!"
        );
      }

      setMensagemFeedback({
        open: true,
        message: modoEdicao
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!",
        severity: "success",
      });

      if (!modoEdicao) {
        // Limpa para novo cadastro
        setDadosFormulario({
          imagemArquivo: null,
          imagemUrl: "",
          titulo: "",
          descricao: "",
          preco: "",
          desconto: "",
          ehNovo: false,
          favorito: false,
          nota: 0,
          estoque: "",
        });
        setPreviewImagem(null);
      }
    } catch (erro) {
      setMensagemFeedback({
        open: true,
        message: erro.message || "Erro ao salvar. Tente novamente.",
        severity: "error",
      });
      throw erro;
    } finally {
      setEnviando(false);
    }
  };

  const fecharSnackbar = () => {
    setMensagemFeedback((anterior) => ({ ...anterior, open: false }));
  };

  return {
    dadosFormulario,
    previewImagem,
    enviando,
    mensagemFeedback,
    lidarComMudanca,
    calcularPrecoComDesconto,
    enviarFormulario,
    fecharSnackbar,
  };
}
