(function(){
  const CODIGO_DOCENTE = "1234";
  const STORAGE_KEY_DOCENTE = "modoDocente";
  const STORAGE_KEY_PUBLICACIONES = "publicaciones";

  const btnDocente = document.getElementById("btnDocente");
  const formulario = document.getElementById("formularioDocente");
  const btnPublicar = document.getElementById("btnPublicar");
  const btnCerrarForm = document.getElementById("btnCerrarForm");
  const publicaciones = document.getElementById("publicaciones");
  const modal = document.getElementById("modalBackdrop");
  const modalOk = document.getElementById("modalOk");
  const modalCancel = document.getElementById("modalCancel");
  const codigoInput = document.getElementById("codigoInput");
  const textoInput = document.getElementById("textoPublicacion");

  let modoDocente = localStorage.getItem(STORAGE_KEY_DOCENTE) === "true";

  function cargarPublicaciones(){
    const guardadas = JSON.parse(localStorage.getItem(STORAGE_KEY_PUBLICACIONES) || "[]");
    publicaciones.innerHTML = "";
    guardadas.forEach(texto => agregarPublicacion(texto, false));
  }

  function guardarPublicaciones(){
    const textos = [...publicaciones.querySelectorAll(".publicacion p")].map(p => p.textContent);
    localStorage.setItem(STORAGE_KEY_PUBLICACIONES, JSON.stringify(textos));
  }

  function abrirModal(){ modal.style.display = "flex"; codigoInput.value = ""; codigoInput.focus(); }
  function cerrarModal(){ modal.style.display = "none"; }

  function agregarPublicacion(texto, guardar){
    const card = document.createElement("div");
    card.className = "publicacion";
    card.innerHTML = `<p>${escapeHtml(texto)}</p><button class="eliminar" type="button">🗑️</button>`;
    publicaciones.prepend(card);
    actualizarBotonesEliminar(modoDocente);
    if (guardar) guardarPublicaciones();
  }

  publicaciones.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("eliminar")) {
      if (modoDocente) {
        if (confirm("¿Eliminar esta publicación?")) {
          e.target.closest(".publicacion").remove();
          guardarPublicaciones();
        }
      } else {
        alert("No tienes permiso para eliminar. Entra en modo docente.");
      }
    }
  });

  function actualizarBotonesEliminar(mostrar){
    document.querySelectorAll(".eliminar").forEach(btn => {
      btn.style.display = mostrar ? "block" : "none";
    });
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    }[c]));
  }

  btnDocente.addEventListener("click", () => {
    if (modoDocente) {
      modoDocente = false;
      localStorage.setItem(STORAGE_KEY_DOCENTE, "false");
      formulario.style.display = "none";
      actualizarBotonesEliminar(false);
      alert("🔒 Has salido del modo docente.");
    } else {
      abrirModal();
    }
  });

  modalCancel.addEventListener("click", cerrarModal);

  modalOk.addEventListener("click", () => {
    if (codigoInput.value.trim() === CODIGO_DOCENTE) {
      modoDocente = true;
      localStorage.setItem(STORAGE_KEY_DOCENTE, "true");
      cerrarModal();
      formulario.style.display = "block";
      actualizarBotonesEliminar(true);
      alert("✅ Acceso concedido. Ya puedes publicar y eliminar.");
    } else {
      alert("❌ Código incorrecto.");
      codigoInput.focus();
    }
  });

  btnPublicar.addEventListener("click", () => {
    if (!modoDocente) { alert("No tienes permiso para publicar."); return; }
    const texto = textoInput.value.trim();
    if (!texto) { alert("Escribe algo antes de publicar."); return; }
    agregarPublicacion(texto, true);
    textoInput.value = "";
  });

  btnCerrarForm.addEventListener("click", () => formulario.style.display = "none");

  cargarPublicaciones();
  actualizarBotonesEliminar(modoDocente);
  if (modoDocente) formulario.style.display = "block";
})();
