// 
export const uploadImage = async (file) => {
  const user = import.meta.env.USER_CLOUDINARY;
  const preset = import.meta.env.UPLOAD_PRESET;
  const url = `https://api.cloudinary.com/v1_1/${user}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset );
  const response = await fetch(url, { method: "POST", body: formData });
  const data = await response.json();
  if (!data.secure_url) throw new Error("Falha ao fazer upload da imagem.");
  return data.secure_url;
};