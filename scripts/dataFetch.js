/**
 * Carga datos desde una ruta local o remota usando fetch.
 * 
 * @param {string} path - Ruta del archivo JSON o endpoint (por ejemplo: "./data/mockArticles.json")
 * @returns {Promise<any>} - Promesa que resuelve con los datos parseados, o null si hay error
 */
export async function dataFetch(path) {
    try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("❌ fetchData:", err);
    return null;
  }
}
