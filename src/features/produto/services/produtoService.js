// src/services/produtoService.js
import { db } from "../../../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} from "firebase/firestore";

/**
 * Referência à coleção "produtos" no Firestore
 */
const produtosRef = collection(db, "produtos");

/**
 * Retorna todos os produtos do banco de dados
 * @returns {Promise<Array<Object>>}
 */
export async function listarProdutos() {
  const snapshot = await getDocs(produtosRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Adiciona um novo produto à coleção
 * @param {Object} produto - dados do produto
 * @returns {Promise<Object>} - produto com id
 */
export async function adicionarProduto(produto) {
  const docRef = await addDoc(produtosRef, produto);
  return { id: docRef.id, ...produto };
}

/**
 * Atualiza os dados de um produto existente
 * @param {string} id - ID do produto
 * @param {Object} dadosAtualizados
 * @returns {Promise<void>}
 */
export async function atualizarProduto(id, dadosAtualizados) {
  const ref = doc(db, "produtos", id);
  await updateDoc(ref, dadosAtualizados);
}

/**
 * Remove um produto do Firestore
 * @param {string} id - ID do produto
 * @returns {Promise<void>}
 */
export async function removerProduto(id) {
  const ref = doc(db, "produtos", id);
  await deleteDoc(ref);
}

export async function getProdutoPorId(id) {
  const ref = doc(db, "produtos", id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  } else {
    throw new Error("Produto não encontrado");
  }
}