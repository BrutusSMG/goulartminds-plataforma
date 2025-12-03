module.exports = [
"[project]/pages/_app.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/_app.js
// Importa os arquivos de CSS que devem ser carregados em TODAS as páginas.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
;
// Esta é uma função especial do Next.js que envolve toda a sua aplicação.
function MyApp({ Component, pageProps }) {
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Remove a classe 'loading' do body depois que o app carregar
        document.body.classList.remove('loading');
    }, []); // O array vazio [] garante que isso rode apenas uma vez
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
        ...pageProps
    }, void 0, false, {
        fileName: "[project]/pages/_app.js",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
const __TURBOPACK__default__export__ = MyApp;
}),
];

//# sourceMappingURL=pages__app_43455d5d.js.map