(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/components/Header.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/Header.js
// Um componente é apenas uma função que retorna HTML (JSX).
__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function Header() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "logo-placeholder"
            }, void 0, false, {
                fileName: "[project]/components/Header.js",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: "Goulart Minds"
            }, void 0, false, {
                fileName: "[project]/components/Header.js",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Descubra o que realmente aciona sua reatividade"
            }, void 0, false, {
                fileName: "[project]/components/Header.js",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Header.js",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Modals.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/Footer.js
__turbopack_context__.s([
    "default",
    ()=>Modals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function Modals() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "progress-overlay",
                className: "modal-overlay",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "progress-bar-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "progress-bar"
                        }, void 0, false, {
                            fileName: "[project]/components/Modals.js",
                            lineNumber: 8,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Processando seu resultado..."
                        }, void 0, false, {
                            fileName: "[project]/components/Modals.js",
                            lineNumber: 9,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Modals.js",
                    lineNumber: 7,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Modals.js",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "success-modal",
                className: "modal-overlay",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-content",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "Relatório Enviado!"
                        }, void 0, false, {
                            fileName: "[project]/components/Modals.js",
                            lineNumber: 14,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Seu diagnóstico completo e o plano de ação foram enviados para o seu e-mail. Verifique sua caixa de entrada (e a de spam)."
                        }, void 0, false, {
                            fileName: "[project]/components/Modals.js",
                            lineNumber: 15,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: "success-ok-btn",
                            className: "primary-btn",
                            children: "Ok"
                        }, void 0, false, {
                            fileName: "[project]/components/Modals.js",
                            lineNumber: 16,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Modals.js",
                    lineNumber: 13,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Modals.js",
                lineNumber: 12,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = Modals;
var _c;
__turbopack_context__.k.register(_c, "Modals");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Copyright.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/Copyright.js
__turbopack_context__.s([
    "default",
    ()=>Copyright
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function Copyright() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "site-footer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: [
                "© ",
                new Date().getFullYear(),
                " Goulart Minds. Todos os direitos reservados."
            ]
        }, void 0, true, {
            fileName: "[project]/components/Copyright.js",
            lineNumber: 6,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Copyright.js",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Copyright;
var _c;
__turbopack_context__.k.register(_c, "Copyright");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/resultado-esperado/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/resultado-esperado/index.js
__turbopack_context__.s([
    "default",
    ()=>FerramentaResultadoEsperado
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modals$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Modals.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Copyright$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Copyright.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function FerramentaResultadoEsperado() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FerramentaResultadoEsperado.useEffect": ()=>{
            function inicializarFerramenta() {
                // --- BLOCO 1: VARIÁVEIS DE NAVEGAÇÃO PRINCIPAL ---
                const steps = document.querySelectorAll('.step');
                if (steps.length === 0) {
                    console.error("Nenhuma etapa (.step) foi encontrada. A ferramenta não pode ser inicializada.");
                    return;
                }
                let currentStep = 0;
                const userAnswers = {};
                // --- BLOCO 2: VARIÁVEIS DA ETAPA 1 (ASSISTENTE SMART) ---
                const explorationContainer = document.getElementById('exploration-container');
                const btnStartSmart = document.getElementById('btn-start-smart');
                const smartConversationContainer = document.getElementById('smart-conversation-container');
                const reviewContainer = document.getElementById('review-container');
                const reviewSummaryText = document.getElementById('review-summary-text');
                const btnEditSmart = document.getElementById('btn-edit-smart');
                const recapExplorationText = document.getElementById('recap-exploration-text');
                const smartHistoryContainer = document.getElementById('smart-history-container');
                const smartLabel = document.getElementById('smart-label');
                const smartInput = document.getElementById('smart-input');
                const dateInputsContainer = document.getElementById('date-inputs-container');
                const smartDateInputStart = document.getElementById('smart-date-input-start');
                const smartDateInputEnd = document.getElementById('smart-date-input-end');
                const nextSmartButton = document.getElementById('btn-next-smart');
                const prevSmartButton = document.getElementById('btn-prev-smart');
                const smartSummaryBox = document.getElementById('smart-summary');
                const smartSummaryText = document.getElementById('smart-summary-text');
                const smartLabelWrapper = document.querySelector('#active-question-container .label-wrapper');
                let smartState = 0;
                let isSmartObjectiveDefined = false;
                const smartQuestions = [
                    {
                        label: "Para começar, qual é o seu grande objetivo ou sonho?",
                        key: 'initial',
                        title: 'Seu Ponto de Partida',
                        help: "Seja o mais sincero(a) possível. Exemplo popular: 'Quero ganhar mais dinheiro'."
                    },
                    {
                        label: "Ótimo. Agora, vamos <strong>aprofundar</strong> seu objetivo para torná-lo concreto e claro. O que, exatamente, você pretende alcançar? Quem são as pessoas envolvidas? Onde isso acontecerá?",
                        key: 'specific',
                        title: 'Aprofundando o Objetivo',
                        help: "Um objetivo claro é fácil de explicar. Exemplo: Em vez de 'ganhar mais dinheiro', poderia ser 'ser promovido a gerente de projetos na minha empresa atual para aumentar meu salário'."
                    },
                    {
                        label: "Excelente. Para tornar seu objetivo <strong>palpável</strong>, o que precisa acontecer para você dizer 'Eu consegui!'? Qual número, métrica ou fato observável comprovará seu sucesso?",
                        key: 'measurable',
                        title: 'Tornando o Objetivo Palpável',
                        help: "O que pode ser medido, pode ser gerenciado. Exemplo: 'Receber um aumento salarial de 20% no meu holerite'."
                    },
                    {
                        label: "Perfeito. Para que seu objetivo seja <strong>acessível</strong>, olhe para a sua situação atual. O que você já tem em mãos (habilidades, contatos, recursos) que pode te ajudar a chegar mais perto dessa conquista?",
                        key: 'achievable',
                        title: 'Tornando o Objetivo Acessível',
                        help: "Isso conecta seu sonho à sua realidade. Exemplo: 'Eu já concluí dois cursos de gestão de projetos e tenho um bom relacionamento com meu chefe, o que torna a promoção uma possibilidade real'."
                    },
                    {
                        label: "Estamos quase lá. Para garantir que seu objetivo seja <strong>realista</strong> e motivador, quais são os benefícios diretos que você terá ao concretizá-lo? Por que isso é tão importante para você?",
                        key: 'relevant',
                        title: 'Tornando o Objetivo Realista',
                        help: "Essa é a sua verdadeira recompensa. Exemplo: 'Com o aumento de 20%, poderei finalmente quitar minhas dívidas e começar a investir no futuro da minha família'."
                    },
                    {
                        label: "Para tornar o início <strong>concreto</strong>, qual é a data para começar a agir e qual é a sua linha de chegada?",
                        key: 'temporal',
                        title: 'Tornando o Início Concreto',
                        type: 'date',
                        help: "Um plano precisa de um ponto de partida e uma linha de chegada. Exemplo: 'Vou começar na próxima segunda-feira e meu objetivo é alcançar a promoção até o final deste semestre'."
                    },
                    {
                        label: "Excelente trabalho! Você transformou um desejo em um plano. Com base em todo o seu histórico, reformule seu objetivo em uma frase final poderosa e inspiradora.",
                        key: 'final',
                        title: 'Seu Objetivo Final',
                        type: 'final'
                    }
                ];
                // --- BLOCO 3: VARIÁVEIS DA ETAPA 2 (FOTOGRAFIA DO SUCESSO) ---
                const photoAssistantContainer = document.getElementById('photo-assistant-container');
                const photoLabel = document.getElementById('photo-label');
                const photoInput = document.getElementById('photo-input');
                const nextPhotoButton = document.getElementById('btn-next-photo');
                const prevPhotoButton = document.getElementById('btn-prev-photo');
                const photoSummaryBox = document.getElementById('photo-summary');
                const photoSummaryText = document.getElementById('photo-summary-text');
                const editPhotoButton = document.getElementById('btn-edit-photo');
                const recapObjetivoStep2 = document.getElementById('recap-objetivo-step2');
                const photoDraftSummaryBox = document.getElementById('photo-draft-summary');
                const photoDraftSummaryText = document.getElementById('photo-draft-summary-text');
                const photoLabelWrapper = document.querySelector('#photo-assistant-container .label-wrapper');
                let photoState = 0;
                let isPhotoDefined = false;
                const photoQuestions = [
                    {
                        label: "Vamos planejar sua cena de sucesso. Qual <strong>seria</strong> o <strong>lugar</strong> ideal para você estar? Seria um local conhecido ou novo? Como ele <strong>seria</strong> (espaçoso, luxuoso, simples)?",
                        key: 'lugar',
                        title: 'O Lugar Ideal',
                        help: "Pense em um local que simbolize sua vitória. Exemplo: '<strong>Seria</strong> na minha nova sala de gerente, que <strong>seria</strong> maior e com uma janela grande com vista para a cidade.'"
                    },
                    {
                        label: "Ótimo. E nesse cenário, quem você <strong>gostaria</strong> de ver? Como as pessoas <strong>estariam</strong> vestidas? Como <strong>seria</strong> a decoração e a iluminação do ambiente?",
                        key: 'visao',
                        title: 'As Pessoas e o Cenário',
                        help: "Pinte um quadro com palavras. Exemplo: 'Eu <strong>gostaria</strong> de ver meu parceiro(a) sorrindo para mim. A iluminação <strong>seria</strong> natural, vindo da janela.'"
                    },
                    {
                        label: "Excelente. E o que você <strong>gostaria</strong> de ouvir? Seriam palavras específicas de reconhecimento? Alguma música estaria tocando?",
                        key: 'audicao',
                        title: 'Os Sons da Conquista',
                        help: "Os sons ancoram a memória. Exemplo: 'Eu <strong>gostaria</strong> de ouvir meu chefe dizendo: 'Nós confiamos em você'. E depois, o som da notificação do banco com o novo salário.'"
                    },
                    {
                        label: "Perfeito. Diante de todo esse cenário planejado, como você <strong>gostaria de se sentir</strong>? Qual emoção você buscaria ao viver essa cena?",
                        key: 'emocao',
                        title: 'A Sensação Desejada',
                        help: "Conecte a conquista a um sentimento. Exemplo: 'Eu <strong>gostaria</strong> de sentir um profundo alívio e orgulho, e a segurança de poder proporcionar um futuro melhor para minha família.'"
                    },
                    {
                        label: "Maravilha! Você planejou todos os elementos. Com base no rascunho da sua cena ideal, descreva agora, de forma organizada, como seria essa 'Fotografia do Sucesso'.",
                        key: 'photo_final',
                        title: 'Sua Fotografia do Sucesso',
                        type: 'final'
                    }
                ];
                // =================================================================
                // === 2. DEFINIÇÃO DAS FUNÇÕES PRINCIPAIS =========================
                // =================================================================
                // --- Funções de Navegação Geral ---
                function showStep(stepIndex) {
                    if (stepIndex === 1) setupStep1();
                    if (stepIndex === 2) setupStep2();
                    if (stepIndex === 4) setupStep4();
                    steps.forEach({
                        "FerramentaResultadoEsperado.useEffect.inicializarFerramenta.showStep": (step, index)=>{
                            step.classList.toggle('active', index === stepIndex);
                        }
                    }["FerramentaResultadoEsperado.useEffect.inicializarFerramenta.showStep"]);
                    currentStep = stepIndex;
                    window.scrollTo(0, 0);
                }
                // --- Funções da Etapa 1: Assistente SMART ---
                function setupStep1() {
                    if (isSmartObjectiveDefined) {
                        explorationContainer.classList.add('hidden');
                        smartConversationContainer.classList.add('hidden');
                        reviewContainer.classList.remove('hidden');
                        reviewSummaryText.textContent = userAnswers['final'];
                    } else {
                        explorationContainer.classList.remove('hidden');
                        smartConversationContainer.classList.add('hidden');
                        reviewContainer.classList.add('hidden');
                    }
                }
                function startSmartAssistant() {
                    smartState = 0;
                    explorationContainer.classList.add('hidden');
                    reviewContainer.classList.add('hidden');
                    smartConversationContainer.classList.remove('hidden');
                    updateSmartQuestion();
                }
                function updateSmartQuestion() {
                    smartInput.value = '';
                    smartInput.classList.add('hidden');
                    dateInputsContainer.classList.add('hidden');
                    smartSummaryBox.classList.add('hidden');
                    smartHistoryContainer.innerHTML = '';
                    const currentQuestion = smartQuestions[smartState];
                    smartLabel.innerHTML = currentQuestion.label;
                    prevSmartButton.classList.toggle('hidden', smartState === 0);
                    const oldTip = smartLabelWrapper.querySelector('.help-tip');
                    if (oldTip) oldTip.remove();
                    if (currentQuestion.help) {
                        const template = document.getElementById('help-tip-template').firstElementChild.cloneNode(true);
                        template.dataset.tooltip = currentQuestion.help;
                        smartLabelWrapper.appendChild(template);
                    }
                    if (currentQuestion.type === 'final') {
                        smartInput.classList.remove('hidden');
                        smartInput.defaultValue = userAnswers[currentQuestion.key] || '';
                        smartInput.placeholder = "Escreva aqui seu objetivo final...";
                        nextSmartButton.textContent = 'Concluir';
                        buildDraftSummary();
                    } else {
                        for(let i = 0; i < smartState; i++){
                            const question = smartQuestions[i];
                            let answer = userAnswers[question.key];
                            let displayAnswer = answer;
                            if (question.type === 'date' && answer) {
                                const start = userAnswers['temporal_start'] ? new Date(userAnswers['temporal_start'] + 'T00:00:00').toLocaleDateString('pt-BR') : '...';
                                const end = userAnswers['temporal_end'] ? new Date(userAnswers['temporal_end'] + 'T00:00:00').toLocaleDateString('pt-BR') : '...';
                                displayAnswer = `Início em ${start}, término em ${end}.`;
                            }
                            if (displayAnswer) {
                                const historyItem = document.createElement('div');
                                historyItem.className = 'history-item';
                                historyItem.innerHTML = `<strong>${question.title}</strong><p>${displayAnswer}</p>`;
                                smartHistoryContainer.appendChild(historyItem);
                            }
                        }
                        if (currentQuestion.type === 'date') {
                            dateInputsContainer.classList.remove('hidden');
                            smartDateInputStart.defaultValue = userAnswers['temporal_start'] || '';
                            smartDateInputEnd.defaultValue = userAnswers['temporal_end'] || '';
                        } else {
                            smartInput.classList.remove('hidden');
                            smartInput.defaultValue = userAnswers[currentQuestion.key] || (currentQuestion.key === 'initial' ? userAnswers['initial'] : '') || '';
                            smartInput.placeholder = "Sua resposta...";
                        }
                        nextSmartButton.textContent = 'Próximo';
                    }
                }
                function buildDraftSummary() {
                    const summaryTitle = document.getElementById('smart-summary-title');
                    summaryTitle.textContent = 'Rascunho do seu Objetivo:';
                    const specific = userAnswers['specific'] || '...';
                    const measurable = userAnswers['measurable'] || '...';
                    const relevant = userAnswers['relevant'] || '...';
                    const startDate = userAnswers['temporal_start'] ? new Date(userAnswers['temporal_start'] + 'T00:00:00').toLocaleDateString('pt-BR') : '...';
                    const endDate = userAnswers['temporal_end'] ? new Date(userAnswers['temporal_end'] + 'T00:00:00').toLocaleDateString('pt-BR') : '...';
                    const draftSentence = `"A partir de <strong>${startDate}</strong>, eu vou <strong>${specific}</strong>, medido por <strong>${measurable}</strong>, com o objetivo de concluir até <strong>${endDate}</strong>. Isso é importante para mim porque <strong>${relevant}</strong>."`;
                    smartSummaryText.innerHTML = draftSentence;
                    smartSummaryBox.classList.remove('hidden');
                }
                // --- Funções da Etapa 2: Fotografia do Sucesso ---
                function setupStep2() {
                    recapObjetivoStep2.textContent = userAnswers['final'] || "Seu objetivo ainda não foi definido na Etapa 1.";
                    if (isPhotoDefined) {
                        showPhotoReviewMode();
                    } else {
                        startPhotoAssistant();
                    }
                }
                function startPhotoAssistant() {
                    photoState = 0;
                    isPhotoDefined = false;
                    photoAssistantContainer.classList.remove('hidden');
                    photoSummaryBox.classList.add('hidden');
                    updatePhotoQuestion();
                }
                function buildPhotoDraftSummary() {
                    const lugar = userAnswers['lugar'] || '...';
                    const visao = userAnswers['visao'] || '...';
                    const audicao = userAnswers['audicao'] || '...';
                    const emocao = userAnswers['emocao'] || '...';
                    photoDraftSummaryText.innerHTML = `No ambiente que descrevi como "<strong>${lugar}</strong>", eu veria "<strong>${visao}</strong>". Ao mesmo tempo, eu ouviria "<strong>${audicao}</strong>" e a sensação principal seria de "<strong>${emocao}</strong>".`;
                    photoDraftSummaryBox.classList.remove('hidden');
                }
                function updatePhotoQuestion() {
                    photoInput.value = '';
                    const currentQuestion = photoQuestions[photoState];
                    photoLabel.innerHTML = currentQuestion.label;
                    photoInput.defaultValue = userAnswers[currentQuestion.key] || '';
                    photoInput.placeholder = "Descreva em detalhes...";
                    prevPhotoButton.classList.toggle('hidden', photoState === 0);
                    photoDraftSummaryBox.classList.add('hidden');
                    const oldTip = photoLabelWrapper.querySelector('.help-tip');
                    if (oldTip) oldTip.remove();
                    if (currentQuestion.help) {
                        const template = document.getElementById('help-tip-template').firstElementChild.cloneNode(true);
                        template.dataset.tooltip = currentQuestion.help;
                        photoLabelWrapper.appendChild(template);
                    }
                    if (currentQuestion.type === 'final') {
                        nextPhotoButton.textContent = 'Concluir';
                        buildPhotoDraftSummary();
                    } else {
                        nextPhotoButton.textContent = 'Próximo';
                    }
                }
                function showPhotoReviewMode() {
                    photoAssistantContainer.classList.add('hidden');
                    photoSummaryText.textContent = userAnswers['photo_final'];
                    photoSummaryBox.classList.remove('hidden');
                }
                // --- Funções da Etapa 4: Compromisso ---
                function setupStep4() {
                    const recapMotivacao = document.getElementById('recap-motivacao-step4');
                    const recapAcessivel = document.getElementById('recap-acessivel-step4');
                    if (recapMotivacao) {
                        recapMotivacao.textContent = userAnswers['relevant'] || "Seu benefício principal ainda não foi definido na Etapa 1.";
                    }
                    if (recapAcessivel) {
                        recapAcessivel.textContent = userAnswers['achievable'] || "Seus recursos iniciais ainda não foram definidos na Etapa 1.";
                    }
                }
                // ===================================================================
                // SEÇÃO 3: EVENT LISTENERS
                // ===================================================================
                // Listener central para todos os cliques
                document.body.addEventListener('click', {
                    "FerramentaResultadoEsperado.useEffect.inicializarFerramenta": (e)=>{
                        const target = e.target; // Boa prática para não repetir e.target
                        // --- Navegação Principal ---
                        if (target.matches('#step-0 .btn-next')) {
                            showStep(1);
                            return;
                        }
                        if (target.classList.contains('btn-next')) {
                            const nextStepIndex = currentStep + 1;
                            if (nextStepIndex < steps.length) {
                                showStep(nextStepIndex);
                            }
                            return;
                        }
                        if (target.classList.contains('btn-prev')) {
                            const prevStepIndex = currentStep - 1;
                            if (prevStepIndex >= 0) {
                                showStep(prevStepIndex);
                            }
                            return;
                        }
                        // --- Assistente SMART (Etapa 1) ---
                        if (target.id === 'btn-start-smart') {
                            const problema = document.getElementById('q-expl-problema').value.trim();
                            const ganho = document.getElementById('q-expl-ganho').value.trim();
                            const indicacao = document.getElementById('q-expl-indicacao').value.trim();
                            if (problema === '' || ganho === '') {
                                alert('Por favor, responda as duas primeiras perguntas para continuarmos.');
                                return; // Para a execução se a validação falhar
                            }
                            userAnswers['expl_problema'] = problema;
                            userAnswers['expl_ganho'] = ganho;
                            userAnswers['expl_indicacao'] = indicacao;
                            // Atualiza o box de recapitulação que aparece no modo assistente
                            if (recapExplorationText) {
                                recapExplorationText.innerHTML = `<strong>O que te trouxe aqui:</strong> ${problema}  
            
            <strong>O que fará valer a pena:</strong> ${ganho}`;
                            }
                            // Define o objetivo inicial para ser usado como base para o "Específico"
                            userAnswers['initial'] = problema;
                            // Inicia o assistente conversacional
                            startSmartAssistant();
                        }
                        if (target.id === 'btn-next-smart') {
                            const currentQuestion = smartQuestions[smartState];
                            // Lida com a pergunta especial de data
                            if (currentQuestion.type === 'date') {
                                const startDate = smartDateInputStart.value.trim();
                                const endDate = smartDateInputEnd.value.trim();
                                if (startDate === '' || endDate === '') {
                                    alert('Por favor, preencha as datas de início e término.');
                                    return;
                                }
                                userAnswers['temporal_start'] = startDate;
                                userAnswers['temporal_end'] = endDate;
                                userAnswers[currentQuestion.key] = `De ${startDate} a ${endDate}`;
                            } else {
                                const currentAnswer = smartInput.value.trim();
                                if (currentAnswer === '') {
                                    alert('Por favor, preencha sua resposta.');
                                    return;
                                }
                                userAnswers[currentQuestion.key] = currentAnswer;
                            }
                            // Avança para a próxima pergunta ou finaliza
                            smartState++;
                            if (smartState < smartQuestions.length) {
                                updateSmartQuestion();
                            } else {
                                isSmartObjectiveDefined = true;
                                // setupStep1() irá automaticamente mostrar o modo de revisão
                                setupStep1();
                            }
                        }
                        if (target.id === 'btn-prev-smart') {
                            // (A lógica que estava no listener do btn-prev-smart vai aqui)
                            if (smartState > 0) {
                                smartState--;
                                updateSmartQuestion();
                            }
                        }
                        if (target.id === 'btn-edit-smart') {
                            smartSummaryBox.classList.add('hidden');
                            smartConversationContainer.classList.remove('hidden');
                            smartState = 0;
                            updateSmartQuestion();
                        }
                        // --- Assistente Fotografia do Sucesso (Etapa 2) ---
                        if (target.id === 'btn-next-photo') {
                            const currentAnswer = photoInput.value.trim();
                            if (currentAnswer === '') {
                                alert('Por favor, preencha sua resposta.');
                                return;
                            }
                            const currentKey = photoQuestions[photoState].key;
                            userAnswers[currentKey] = currentAnswer;
                            photoState++;
                            if (photoState < photoQuestions.length) {
                                updatePhotoQuestion();
                            } else {
                                isPhotoDefined = true;
                                showPhotoReviewMode();
                            }
                        }
                        if (target.id === 'btn-prev-photo') {
                            if (photoState > 0) {
                                photoState--;
                                updatePhotoQuestion();
                            }
                        }
                        if (target.id === 'btn-edit-photo') {
                            photoState = photoQuestions.length - 1;
                            photoAssistantContainer.classList.remove('hidden');
                            photoSummaryBox.classList.add('hidden');
                            updatePhotoQuestion();
                        }
                        // --- Ensaio Mental (Etapa 3) ---
                        if (target.id === 'btn-concluir-ensaio') {
                            showStep(4); // Avança para a etapa de Compromisso
                        }
                        // --- Finalização e Impressão (Etapa 5) ---
                        if (target.id === 'btn-finalizar') {
                            generateFinalSummary();
                            showStep(steps.length - 1);
                        }
                        if (target.id === 'btn-print') {
                            const summaryStep = document.getElementById('step-5');
                            if (summaryStep) {
                                summaryStep.classList.add('printable');
                                window.print();
                                summaryStep.classList.remove('printable');
                            }
                        }
                    }
                }["FerramentaResultadoEsperado.useEffect.inicializarFerramenta"]);
                document.body.addEventListener('input', {
                    "FerramentaResultadoEsperado.useEffect.inicializarFerramenta": (e)=>{
                        // Lógica para o slider de responsabilidade
                        if (e.target.id === 'slider-responsabilidade') {
                            const responsabilidadeValue = document.getElementById('responsabilidade-value');
                            const responsabilidadeExtraContainer = document.getElementById('responsabilidade-extra-container');
                            const value = e.target.value;
                            if (responsabilidadeValue) responsabilidadeValue.textContent = `${value}%`;
                            if (responsabilidadeExtraContainer) responsabilidadeExtraContainer.classList.toggle('hidden', value >= 100);
                        }
                        // Lógica para o slider de comprometimento
                        if (e.target.id === 'slider-comprometimento') {
                            const comprometimentoValue = document.getElementById('comprometimento-value');
                            if (comprometimentoValue) comprometimentoValue.textContent = e.target.value;
                        }
                    }
                }["FerramentaResultadoEsperado.useEffect.inicializarFerramenta"]);
                let activeTooltip = null; // Variável de controle, no escopo do script
                // MOSTRAR o tooltip ao passar o mouse sobre um .help-tip
                document.body.addEventListener('mouseover', {
                    "FerramentaResultadoEsperado.useEffect.inicializarFerramenta": (e)=>{
                        // Só continua se o alvo for um .help-tip
                        if (!e.target.classList.contains('help-tip')) return;
                        // Previne múltiplos tooltips se o mouse se mover rapidamente
                        if (activeTooltip) return;
                        const icon = e.target;
                        const tooltipText = icon.dataset.tooltip;
                        // Cria o elemento do tooltip
                        activeTooltip = document.createElement('div');
                        activeTooltip.className = 'dynamic-tooltip';
                        activeTooltip.innerHTML = tooltipText;
                        document.body.appendChild(activeTooltip);
                        // Calcula a posição ideal
                        const iconRect = icon.getBoundingClientRect();
                        const tooltipRect = activeTooltip.getBoundingClientRect();
                        let top = iconRect.top - tooltipRect.height - 10; // Posição padrão: acima
                        let left = iconRect.left + iconRect.width / 2 - tooltipRect.width / 2;
                        // Ajusta para não sair da tela
                        if (left < 10) left = 10;
                        if (left + tooltipRect.width > window.innerWidth - 10) {
                            left = window.innerWidth - tooltipRect.width - 10;
                        }
                        if (top < 10) {
                            top = iconRect.bottom + 10;
                        }
                        // Aplica a posição (considerando o scroll da página)
                        activeTooltip.style.top = `${top + window.scrollY}px`;
                        activeTooltip.style.left = `${left + window.scrollX}px`;
                        // Adiciona a classe para o efeito de fade-in
                        setTimeout({
                            "FerramentaResultadoEsperado.useEffect.inicializarFerramenta": ()=>{
                                if (activeTooltip) activeTooltip.classList.add('visible');
                            }
                        }["FerramentaResultadoEsperado.useEffect.inicializarFerramenta"], 10);
                    }
                }["FerramentaResultadoEsperado.useEffect.inicializarFerramenta"]);
                // ESCONDER o tooltip ao tirar o mouse de um .help-tip
                document.body.addEventListener('mouseout', {
                    "FerramentaResultadoEsperado.useEffect.inicializarFerramenta": (e)=>{
                        // Só continua se o alvo for um .help-tip E se houver um tooltip ativo
                        if (!e.target.classList.contains('help-tip') || !activeTooltip) return;
                        // Inicia o processo de remoção
                        activeTooltip.classList.remove('visible');
                        // Remove o elemento do DOM após a transição de fade-out
                        setTimeout({
                            "FerramentaResultadoEsperado.useEffect.inicializarFerramenta": ()=>{
                                if (activeTooltip && activeTooltip.parentElement) {
                                    document.body.removeChild(activeTooltip);
                                }
                                activeTooltip = null; // Libera a variável de controle
                            }
                        }["FerramentaResultadoEsperado.useEffect.inicializarFerramenta"], 300); // O tempo deve ser igual à duração da transição no CSS
                    }
                }["FerramentaResultadoEsperado.useEffect.inicializarFerramenta"]);
                function generateFinalSummary() {
                    const summaryContent = document.getElementById('summary-content');
                    userAnswers['responsabilidade_quem'] = document.getElementById('q-responsabilidade-quem').value;
                    userAnswers['responsabilidade_percent'] = document.getElementById('slider-responsabilidade').value;
                    userAnswers['responsabilidade_extra'] = document.getElementById('q-responsabilidade-extra').value;
                    userAnswers['motivacao_final'] = document.getElementById('q-motivacao').value;
                    userAnswers['tarefa_inicial'] = document.getElementById('q-tarefa').value;
                    // **AJUSTE AQUI**: Inclui a terceira pergunta da exploração no resumo
                    summaryContent.innerHTML = `
                    <h3>🧭 Minha Exploração Inicial</h3>
                    <p>
                        <strong>O que me trouxe aqui:</strong> ${userAnswers['expl_problema'] || 'Não definido.'}  

                        <strong>O que fará valer a pena:</strong> ${userAnswers['expl_ganho'] || 'Não definido.'}  

                        <strong>Nível de satisfação para indicar:</strong> ${userAnswers['expl_indicacao'] || 'Não definido.'}
                    </p>

                    <h3>🎯 Meu Objetivo SMART</h3>
                    <p>${userAnswers['final'] || 'Não definido.'}</p>

                    <h3>📸 A Fotografia do Meu Sucesso</h3>
                    <p>${userAnswers['photo_final'] || 'Não definida.'}</p>

                    <h3>💪 Minha Responsabilidade</h3>
                    <p>
                        <strong>De quem é a responsabilidade:</strong> ${userAnswers['responsabilidade_quem'] || 'Não definido.'}  

                        <strong>Quanto depende de mim:</strong> ${userAnswers['responsabilidade_percent'] || '0'}%  

                        ${userAnswers['responsabilidade_percent'] < 100 && userAnswers['responsabilidade_extra'] ? `<strong>Como aumentar minha responsabilidade:</strong> ${userAnswers['responsabilidade_extra']}  
                    ` : ''}
                    </p>

                    <h3>🔥 Minha Motivação Profunda</h3>
                    <p>${userAnswers['motivacao_final'] || 'Não definida.'}</p>

                    <h3>🚀 Minha Próxima Tarefa</h3>
                    <p>${userAnswers['tarefa_inicial'] || 'Não definida.'}</p>
                `;
                }
                showStep(0);
            }
            // Chama a função principal que inicializa toda a ferramenta.
            inicializarFerramenta();
        }
    }["FerramentaResultadoEsperado.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "help-tip-template",
                style: {
                    display: 'none'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "help-tip",
                    "data-tooltip": "",
                    children: "?"
                }, void 0, false, {
                    fileName: "[project]/pages/resultado-esperado/index.js",
                    lineNumber: 538,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/resultado-esperado/index.js",
                lineNumber: 537,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/pages/resultado-esperado/index.js",
                        lineNumber: 543,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "tool-wrapper",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "step-0",
                                className: "step active",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                children: "🌟 Ferramenta: Resultado Esperado"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 553,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Esta ferramenta te guiará para transformar um desejo vago em um objetivo claro e poderoso. Responda com calma e sinceridade."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 554,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 552,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-content",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "info-box",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    children: "O Segredo de um Objetivo Poderoso"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/resultado-esperado/index.js",
                                                    lineNumber: 558,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: 'Muitas vezes, nossos desejos são sentimentos (ex: "quero ser feliz"). Para alcançá-los, precisamos transformá-los em algo concreto e palpável. Ao longo desta jornada, vamos te ajudar a fazer exatamente isso.'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/resultado-esperado/index.js",
                                                    lineNumber: 559,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/resultado-esperado/index.js",
                                            lineNumber: 557,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 556,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-navigation",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn-next",
                                            children: "Começar"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/resultado-esperado/index.js",
                                            lineNumber: 563,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 562,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/resultado-esperado/index.js",
                                lineNumber: 551,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "step-1",
                                className: "step",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Etapa 1: Definição do Objetivo"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 572,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Vamos começar entendendo o que te trouxe até aqui para, então, construir um objetivo claro e poderoso usando a metodologia SMART."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 573,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 571,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-content",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                id: "exploration-container",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "question-block",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                htmlFor: "q-expl-problema",
                                                                children: "O que te trouxe até aqui? O que fez você parar e dedicar seu tempo a esta ferramenta neste exato momento?"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 580,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                id: "q-expl-problema",
                                                                placeholder: "Seja sincero(a). Ex: 'Sinto que estou estagnado(a) na carreira', 'Minha vida financeira está uma bagunça', 'Não tenho tempo para mim'..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 581,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 579,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "question-block",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                htmlFor: "q-expl-ganho",
                                                                children: 'Imagine que você chegou ao final desta jornada. O que precisa ter acontecido para você dizer "Uau, valeu muito a pena!"?'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 584,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                id: "q-expl-ganho",
                                                                placeholder: "Descreva o resultado ideal. Ex: 'Ter um plano claro para os próximos 6 meses', 'Sentir que retomei o controle da minha vida'..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 585,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 583,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "question-block",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                htmlFor: "q-expl-indicacao",
                                                                children: "E o que te deixaria tão satisfeito(a) a ponto de querer indicar esta ferramenta para um amigo querido?"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 588,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                id: "q-expl-indicacao",
                                                                placeholder: "Qual nível de transformação você espera? Ex: 'Se eu conseguir destravar uma decisão importante', 'Se eu me sentir mais motivado(a) e com mais energia'..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 589,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 587,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "subtask-navigation",
                                                        style: {
                                                            justifyContent: 'flex-end'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            id: "btn-start-smart",
                                                            className: "btn-next-small",
                                                            children: "Definir meu Objetivo"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/resultado-esperado/index.js",
                                                            lineNumber: 592,
                                                            columnNumber: 37
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 591,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 578,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                id: "smart-conversation-container",
                                                className: "hidden",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "recap-box",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Suas Reflexões Iniciais:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 599,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                id: "recap-exploration-text",
                                                                children: "Carregando..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 600,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 598,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        id: "smart-history-container"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 602,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        id: "active-question-container",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "label-wrapper",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    id: "smart-label",
                                                                    htmlFor: "smart-input",
                                                                    children: "..."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/resultado-esperado/index.js",
                                                                    lineNumber: 605,
                                                                    columnNumber: 41
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 604,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                id: "smart-summary",
                                                                className: "draft-box hidden",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        id: "smart-summary-title"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                                        lineNumber: 608,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        id: "smart-summary-text"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                                        lineNumber: 609,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 607,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                id: "input-fields-wrapper",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                        id: "smart-input",
                                                                        placeholder: "Escreva sua resposta aqui..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                                        lineNumber: 612,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        id: "date-inputs-container",
                                                                        className: "hidden",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "date-input-wrapper",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                        htmlFor: "smart-date-input-start",
                                                                                        children: "Data de Início"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                                                        lineNumber: 615,
                                                                                        columnNumber: 49
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "date",
                                                                                        id: "smart-date-input-start"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                                                        lineNumber: 616,
                                                                                        columnNumber: 49
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                                lineNumber: 614,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "date-input-wrapper",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                        htmlFor: "smart-date-input-end",
                                                                                        children: "Data de Término"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                                                        lineNumber: 619,
                                                                                        columnNumber: 49
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "date",
                                                                                        id: "smart-date-input-end"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                                                        lineNumber: 620,
                                                                                        columnNumber: 49
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                                lineNumber: 618,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                                        lineNumber: 613,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 611,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 603,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "subtask-navigation",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                id: "btn-prev-smart",
                                                                className: "btn-prev-small hidden",
                                                                children: "Voltar"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 626,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                id: "btn-next-smart",
                                                                className: "btn-next-small",
                                                                children: "Próximo"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 627,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 625,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 597,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                id: "review-container",
                                                className: "hidden",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        id: "review-summary",
                                                        className: "draft-box",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Seu Objetivo definido é:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 634,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                id: "review-summary-text"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 635,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 633,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        id: "btn-edit-smart",
                                                        className: "btn-prev-small",
                                                        style: {
                                                            marginTop: '1rem'
                                                        },
                                                        children: "Editar Objetivo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 637,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 632,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 575,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-navigation",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn-prev",
                                                children: "Voltar"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 641,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn-next",
                                                children: "Avançar"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 642,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 640,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/resultado-esperado/index.js",
                                lineNumber: 570,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "step",
                                id: "step-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Etapa 2: A Fotografia do Sucesso"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 651,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Imagine que viajou no tempo e seu objetivo já foi alcançado. Vamos descrever essa cena com o máximo de detalhes racionais, como um planejamento."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 652,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 650,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-content",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "recap-box",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        children: "Seu objetivo definido é:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 656,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        id: "recap-objetivo-step2",
                                                        children: "Carregando..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 657,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 655,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                id: "photo-assistant-container",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "label-wrapper",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            id: "photo-label",
                                                            htmlFor: "photo-input",
                                                            children: "Pergunta inicial..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/resultado-esperado/index.js",
                                                            lineNumber: 661,
                                                            columnNumber: 37
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 660,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        id: "photo-draft-summary",
                                                        className: "draft-box hidden",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Rascunho da sua Cena:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 664,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                id: "photo-draft-summary-text"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 665,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 663,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        id: "photo-input",
                                                        placeholder: "Descreva em detalhes..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 667,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "subtask-navigation",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                id: "btn-prev-photo",
                                                                className: "btn-prev-small hidden",
                                                                children: "Voltar"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 669,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                id: "btn-next-photo",
                                                                className: "btn-next-small",
                                                                children: "Próximo"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 670,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 668,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 659,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                id: "photo-summary",
                                                className: "hidden",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        children: "Sua Fotografia do Sucesso:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 674,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        id: "photo-summary-text"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 675,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        id: "btn-edit-photo",
                                                        className: "btn-prev-small",
                                                        style: {
                                                            marginTop: '1rem'
                                                        },
                                                        children: "Editar Fotografia"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 676,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 673,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 654,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-navigation",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn-prev",
                                                children: "Voltar"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 680,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn-next",
                                                children: "Avançar"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 681,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 679,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/resultado-esperado/index.js",
                                lineNumber: 649,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "step-3",
                                className: "step",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Etapa 3: O Ensaio Mental Guiado"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 690,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Esta é a etapa mais importante. Vamos transformar seu planejamento em uma experiência real e emocional."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 691,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 689,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-content",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "media-wrapper",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        children: "Uma mensagem para você:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 695,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                        controls: true,
                                                        controlsList: "nodownload",
                                                        style: {
                                                            width: '100%',
                                                            borderRadius: '8px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                                src: "../assets/video-intro.mp4",
                                                                type: "video/mp4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 697,
                                                                columnNumber: 37
                                                            }, this),
                                                            "Seu navegador não suporta o elemento de vídeo."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 696,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 694,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "media-wrapper",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        children: "Seu Ensaio Mental:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 702,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            textAlign: 'center',
                                                            marginBottom: '1rem'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                            children: "\"Agora, encontre uma posição confortável, feche os olhos e pressione 'Play'.\""
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/resultado-esperado/index.js",
                                                            lineNumber: 703,
                                                            columnNumber: 88
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 703,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                                                        controls: true,
                                                        controlsList: "nodownload",
                                                        style: {
                                                            width: '100%'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                                                src: "../assets/audio-ensaio.mp3",
                                                                type: "audio/mpeg"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 705,
                                                                columnNumber: 37
                                                            }, this),
                                                            "Seu navegador não suporta o elemento de áudio."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 704,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 701,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 693,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-navigation",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn-prev",
                                                children: "Voltar"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 711,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn-next",
                                                children: "Avançar"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 712,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 710,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/resultado-esperado/index.js",
                                lineNumber: 688,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "step-4",
                                className: "step",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Etapa 4: Compromisso e Ação"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 721,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Você sentiu a emoção da conquista. Agora, vamos transformar essa energia em um plano de ação concreto."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 722,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 720,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-content",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "question-block",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "q-motivacao",
                                                        children: "Para selar sua motivação, releia o benefício que você definiu na Etapa 1 e reforce: por que alcançar esse objetivo é inegociável para você?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 728,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "recap-box",
                                                        style: {
                                                            marginBottom: '1rem'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: 'Lembre-se do seu "Porquê" (Benefício):'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 730,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                id: "recap-motivacao-step4",
                                                                children: "Carregando..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 731,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 729,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        id: "q-motivacao",
                                                        placeholder: "Reforce sua motivação com suas próprias palavras..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 733,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 727,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "question-block",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Para construir sua confiança, lembre-se dos recursos que você já possui."
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 738,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "recap-box",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Você já tem o que é preciso para começar (Recursos):"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 740,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                id: "recap-acessivel-step4",
                                                                children: "Carregando..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 741,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 739,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 737,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "question-block",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "q-responsabilidade-quem",
                                                        children: "De quem é a responsabilidade de conseguir isso?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 747,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        id: "q-responsabilidade-quem",
                                                        placeholder: "Ex: Minha, minha e do meu chefe, etc."
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 748,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "slider-responsabilidade",
                                                        style: {
                                                            marginTop: '1rem'
                                                        },
                                                        children: "De 0 a 100%, quanto o sucesso dessa jornada depende exclusivamente de você?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 750,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        id: "slider-responsabilidade",
                                                        min: "0",
                                                        max: "100",
                                                        defaultValue: "80",
                                                        className: "slider"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 751,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        id: "responsabilidade-value",
                                                        className: "slider-value",
                                                        children: "80%"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 752,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        id: "responsabilidade-extra-container",
                                                        className: "hidden",
                                                        style: {
                                                            marginTop: '1rem'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                htmlFor: "q-responsabilidade-extra",
                                                                children: "O que você poderia fazer para que esse número aumente, para que dependa um pouquinho mais só de você?"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 756,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                id: "q-responsabilidade-extra",
                                                                placeholder: "Ex: Em vez de esperar uma oportunidade, posso criar uma. Em vez de depender de alguém, posso aprender a fazer."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 757,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 755,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 746,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "question-block",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "slider-comprometimento",
                                                        children: "Com essa clareza e motivação, de 0 a 10, qual o seu nível de comprometimento em fazer o que for preciso para dar o próximo passo?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 763,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        id: "slider-comprometimento",
                                                        min: "0",
                                                        max: "10",
                                                        defaultValue: "8",
                                                        className: "slider"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 764,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        id: "comprometimento-value",
                                                        className: "slider-value",
                                                        children: "8"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 765,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 762,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "question-block",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "q-tarefa",
                                                        children: [
                                                            "Excelente! Agora, qual é o ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "primeiro e menor passo"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                                lineNumber: 770,
                                                                columnNumber: 86
                                                            }, this),
                                                            " (algo que você possa fazer em até 15 minutos) que você dará na próxima semana para iniciar sua jornada?"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 770,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        id: "q-tarefa",
                                                        placeholder: "Ex: Enviar um e-mail para marcar aquela conversa; pesquisar por 15 minutos sobre o tema X; arrumar a gaveta do escritório..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 771,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 769,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 724,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-navigation",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn-prev",
                                                children: "Voltar"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 776,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                id: "btn-finalizar",
                                                children: "Finalizar e Ver Resumo"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 777,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 775,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/resultado-esperado/index.js",
                                lineNumber: 719,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "step-5",
                                className: "step",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '0.5rem'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        children: "Seu Plano de Ação"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 788,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        id: "btn-print",
                                                        className: "btn-icon",
                                                        title: "Imprimir ou Salvar como PDF",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            width: "24",
                                                            height: "24",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "2",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                    points: "6 9 6 2 18 2 18 9"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/resultado-esperado/index.js",
                                                                    lineNumber: 790,
                                                                    columnNumber: 215
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/resultado-esperado/index.js",
                                                                    lineNumber: 790,
                                                                    columnNumber: 263
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                    x: "6",
                                                                    y: "14",
                                                                    width: "12",
                                                                    height: "8"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/resultado-esperado/index.js",
                                                                    lineNumber: 790,
                                                                    columnNumber: 355
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/resultado-esperado/index.js",
                                                            lineNumber: 790,
                                                            columnNumber: 37
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                                        lineNumber: 789,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 787,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Parabéns por concluir a jornada! Guarde este plano e consulte-o sempre que precisar de motivação."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/resultado-esperado/index.js",
                                                lineNumber: 795,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 785,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: "summary-content",
                                        className: "step-content"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 798,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "step-navigation",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn-prev",
                                            children: "Voltar"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/resultado-esperado/index.js",
                                            lineNumber: 802,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/resultado-esperado/index.js",
                                        lineNumber: 801,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/resultado-esperado/index.js",
                                lineNumber: 784,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/resultado-esperado/index.js",
                        lineNumber: 545,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/resultado-esperado/index.js",
                lineNumber: 541,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modals$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/resultado-esperado/index.js",
                lineNumber: 808,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Copyright$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/resultado-esperado/index.js",
                lineNumber: 809,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
_s(FerramentaResultadoEsperado, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = FerramentaResultadoEsperado;
var _c;
__turbopack_context__.k.register(_c, "FerramentaResultadoEsperado");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/resultado-esperado/index.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/resultado-esperado";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/resultado-esperado/index.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/resultado-esperado/index.js\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/resultado-esperado/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__748e28de._.js.map