import React from "react";
import { useProdutoForm } from "../../hooks/useProdutoForm";
import { Snackbar, Alert } from "@mui/material";
import styles from "./ProdutoForm.module.css";

export default function ProdutoForm({
  initialData,
  onSubmit: aoEnviar,
  onCancel,
  modoEdicao = false,
  onSubmitCallback,
}) {
  const {
    dadosFormulario,
    previewImagem,
    enviando,
    mensagemFeedback,
    lidarComMudanca,
    calcularPrecoComDesconto,
    enviarFormulario,
    fecharSnackbar,
  } = useProdutoForm({ initialData, modoEdicao, onSubmitCallback });

  return (
    <div className={styles.pageWrapper}>
      <form
        className={styles.formulario}
        onSubmit={(evento) => {
          evento.preventDefault();
          enviarFormulario(aoEnviar);
        }}
      >
        <h2 className={styles.formTitle}>
          {modoEdicao ? "Editar Produto" : "Cadastrar Produto"}
        </h2>

        <div className={styles.formSplitLayout}>
          {/* Imagem */}
          <div className={styles.imagemWrapper}>
            {previewImagem && (
              <img
                src={previewImagem}
                alt="Pré-visualização"
                className={styles.imagePreview}
              />
            )}

            {!modoEdicao && (
              <div className={styles.inputGroup}>
                <label htmlFor="imagemArquivo">
                  Imagem do Produto (arquivo)
                </label>
                <input
                  type="file"
                  id="imagemArquivo"
                  name="imagemArquivo"
                  onChange={lidarComMudanca}
                  className={styles.input}
                />
              </div>
            )}

            {modoEdicao && (
              <div className={styles.inputGroup}>
                <label htmlFor="imagemUrl">Imagem do Produto (URL)</label>
                <input
                  type="text"
                  id="imagemUrl"
                  name="imagemUrl"
                  value={dadosFormulario.imagemUrl}
                  onChange={lidarComMudanca}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className={styles.input}
                />
              </div>
            )}
          </div>

          {/* Campos */}
          <div className={styles.camposWrapper}>
            <div className={styles.inputGroup}>
              <label htmlFor="titulo">Título</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={dadosFormulario.titulo}
                onChange={lidarComMudanca}
                placeholder="Título"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={dadosFormulario.descricao}
                onChange={lidarComMudanca}
                placeholder="Descrição"
                className={styles.textarea}
              />
            </div>

            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label htmlFor="preco">Preço</label>
                <input
                  type="number"
                  id="preco"
                  name="preco"
                  value={dadosFormulario.preco}
                  onChange={lidarComMudanca}
                  placeholder="Preço"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="desconto">Desconto (%)</label>
                <input
                  type="number"
                  id="desconto"
                  name="desconto"
                  value={dadosFormulario.desconto}
                  onChange={lidarComMudanca}
                  placeholder="Desconto (%)"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="estoque">Estoque</label>
              <input
                type="number"
                id="estoque"
                name="estoque"
                min="0"
                step="1"
                value={dadosFormulario.estoque}
                onChange={lidarComMudanca}
                placeholder="Quantidade em estoque"
                className={styles.input}
              />
            </div>

            <div className={styles.resultadoBox}>
              <span>Preço com Desconto:</span>
              <strong>{calcularPrecoComDesconto()}</strong>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="nota">Nota</label>
              <input
                type="number"
                name="nota"
                id="nota"
                min="0"
                max="5"
                step="1"
                value={dadosFormulario.nota}
                onChange={lidarComMudanca}
                className={styles.input}
              />
            </div>

            <div className={styles.checkboxBox}>
              <label>
                <input
                  type="checkbox"
                  name="ehNovo"
                  checked={dadosFormulario.ehNovo}
                  onChange={lidarComMudanca}
                />
                É novidade?
              </label>

              <label>
                <input
                  type="checkbox"
                  name="favorito"
                  checked={dadosFormulario.favorito}
                  onChange={lidarComMudanca}
                />
                Favorito
              </label>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={enviando}
              >
                {enviando
                  ? "Salvando..."
                  : modoEdicao
                  ? "Salvar Alterações"
                  : "Cadastrar"}
              </button>

              {onCancel && (
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={onCancel}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <Snackbar
          open={mensagemFeedback.open}
          autoHideDuration={4000}
          onClose={fecharSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={fecharSnackbar}
            severity={mensagemFeedback.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {mensagemFeedback.message}
          </Alert>
        </Snackbar>
      </form>
    </div>
  );
}
