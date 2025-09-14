// src/services/cloudinary.js
export const uploadImage = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

  if (!file) {
    throw new Error("Nenhum arquivo selecionado para upload.");
  }
  if (!cloudName || !preset) {
    throw new Error(
      "Configuração do Cloudinary ausente. Verifique VITE_CLOUDINARY_CLOUD_NAME e VITE_CLOUDINARY_UNSIGNED_PRESET no .env."
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  if (folder) formData.append("folder", folder);

  const resp = await fetch(url, {
    method: "POST",
    body: formData,
  });

  // Cloudinary SEMPRE retorna 200/400 com JSON; verifique resp.ok
  let data;
  try {
    data = await resp.json();
  } catch {
    throw new Error("Resposta inválida do Cloudinary.");
  }

  if (!resp.ok) {
    const msg = data?.error?.message || "Falha no upload (HTTP).";
    throw new Error(`Cloudinary: ${msg}`);
  }

  const secureUrl = data?.secure_url;
  if (!secureUrl) {
    const msg = data?.error?.message || "Falha ao obter URL da imagem.";
    throw new Error(`Cloudinary: ${msg}`);
  }

  return secureUrl;
};
