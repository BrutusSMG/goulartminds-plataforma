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
__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function Header({ hideLoginButton }) {
    _s();
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"])();
    const loading = status === 'loading';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "logo-placeholder"
            }, void 0, false, {
                fileName: "[project]/components/Header.js",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/",
                style: {
                    textDecoration: 'none',
                    color: 'inherit'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "Goulart Minds"
                    }, void 0, false, {
                        fileName: "[project]/components/Header.js",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Descubra o que realmente aciona sua reatividade"
                    }, void 0, false, {
                        fileName: "[project]/components/Header.js",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Header.js",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "login-controls",
                style: {
                    marginTop: '20px',
                    borderTop: '1px solid #eee',
                    paddingTop: '10px'
                },
                children: [
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Carregando..."
                    }, void 0, false, {
                        fileName: "[project]/components/Header.js",
                        lineNumber: 20,
                        columnNumber: 21
                    }, this),
                    !loading && !session && !hideLoginButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["signIn"])('email', {
                                callbackUrl: '/'
                            }),
                        children: "Entrar com E-mail"
                    }, void 0, false, {
                        fileName: "[project]/components/Header.js",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this),
                    !loading && session && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/perfil",
                                legacyBehavior: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    className: "profile-link",
                                    style: {
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        cursor: 'pointer'
                                    },
                                    children: [
                                        "Olá, ",
                                        session.user.name || session.user.email
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Header.js",
                                    lineNumber: 31,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 30,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["signOut"])(),
                                style: {
                                    padding: '10px 15px',
                                    cursor: 'pointer'
                                },
                                children: "Sair"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.js",
                                lineNumber: 36,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Header.js",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Header.js",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Header.js",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_s(Header, "ujwIunAD3hlHFoJLG3BNiDLiMqM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
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
"[project]/pages/irritacao/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FerramentaIrritacao
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Copyright$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Copyright.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modals$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Modals.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function FerramentaIrritacao() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FerramentaIrritacao.useEffect": ()=>{
            function inicializarFerramenta() {
                // --- 1. DEFINIÇÕES E DADOS (sem alteração) ---
                const sliderLegends = {
                    0: "🧘 Nunca ou quase nunca",
                    1: "🤔 Raramente",
                    2: "😠 Às vezes",
                    3: "🗣️ Frequentemente",
                    4: "🔥 Sempre ou quase sempre"
                };
                const questions = [
                    {
                        id: 'q1',
                        text: 'Você explica algo importante e a pessoa parece não ter prestado atenção, te forçando a repetir.',
                        type: 'injustica'
                    },
                    {
                        id: 'q2',
                        text: 'A tecnologia que você precisa usar (internet, um software, o celular) fica lenta ou para de funcionar no meio de uma tarefa.',
                        type: 'frustracao'
                    },
                    {
                        id: 'q3',
                        text: 'Você está mentalmente cansado após um dia longo e alguém te pede "só mais uma coisinha".',
                        type: 'cansaco'
                    },
                    {
                        id: 'q4',
                        text: 'Você está prestes a apresentar uma ideia e percebe que pode ser julgado ou criticado negativamente.',
                        type: 'medo'
                    },
                    {
                        id: 'q5',
                        text: 'Você se esforça em um projeto e outra pessoa que fez menos recebe o mesmo (ou mais) reconhecimento.',
                        type: 'injustica'
                    },
                    {
                        id: 'q6',
                        text: 'Você está com pressa e a pessoa na sua frente está fazendo as coisas de forma lenta e ineficiente.',
                        type: 'frustracao'
                    },
                    {
                        id: 'q7',
                        text: 'Você dormiu mal e precisa lidar com problemas e interrupções que normalmente não te afetariam.',
                        type: 'cansaco'
                    },
                    {
                        id: 'q8',
                        text: 'Você comete um pequeno erro e imediatamente pensa: "O que vão pensar de mim?".',
                        type: 'medo'
                    },
                    {
                        id: 'q9',
                        text: 'Você precisa realizar uma tarefa simples, mas o processo é cheio de burocracia e etapas desnecessárias.',
                        type: 'frustracao'
                    },
                    {
                        id: 'q10',
                        text: 'Alguém questiona sua competência ou sua decisão na frente de outras pessoas.',
                        type: 'medo'
                    },
                    {
                        id: 'q11',
                        text: 'Você percebe que está dando muito mais em um relacionamento (pessoal ou profissional) do que está recebendo.',
                        type: 'injustica'
                    },
                    {
                        id: 'q12',
                        text: 'Sua rotina é constantemente interrompida por demandas de outras pessoas, te impedindo de focar.',
                        type: 'cansaco'
                    }
                ];
                let userResponses = {};
                let currentQuestionIndex = 0;
                // --- 2. ELEMENTOS DO DOM ---
                const carouselStage = document.getElementById('carousel-stage');
                const prevBtn = document.getElementById('carousel-prev');
                const nextBtn = document.getElementById('carousel-next');
                const counterEl = document.getElementById('carousel-counter');
                const mainContinueBtn = document.getElementById('goto-step2-btn');
                const carouselNav = document.getElementById('carousel-navigation');
                if (!carouselStage || !prevBtn || !nextBtn || !counterEl || !mainContinueBtn) {
                    console.error("Erro crítico: Um ou mais elementos do carrossel não foram encontrados no DOM.");
                    return; // Para a execução da função aqui.
                }
                // --- 3. LÓGICA DO CARROSSEL ---
                function renderQuestionsAsCarousel() {
                    if (!carouselStage) return;
                    carouselStage.innerHTML = '';
                    questions.forEach({
                        "FerramentaIrritacao.useEffect.inicializarFerramenta.renderQuestionsAsCarousel": (q, index)=>{
                            // --- CORREÇÃO: CONSTRUINDO OS ELEMENTOS MANUALMENTE ---
                            // 1. Cria o card principal
                            const card = document.createElement('div');
                            card.className = 'question-card';
                            // 2. Cria o parágrafo da pergunta
                            const questionText = document.createElement('p');
                            questionText.className = 'question-text';
                            questionText.innerHTML = `<b>${index + 1}.</b> ${q.text}`; // innerHTML aqui é seguro para o <b>
                            // 3. Cria o contêiner do slider
                            const sliderContainer = document.createElement('div');
                            sliderContainer.className = 'slider-container';
                            sliderContainer.dataset.questionId = q.id;
                            // 4. Cria o input do slider
                            const sliderInput = document.createElement('input');
                            sliderInput.type = 'range';
                            sliderInput.min = '0';
                            sliderInput.max = '4';
                            sliderInput.defaultValue = '0'; // Usamos defaultValue
                            sliderInput.className = 'irritation-slider';
                            // 5. Cria o contêiner de feedback
                            const feedbackDiv = document.createElement('div');
                            feedbackDiv.className = 'slider-feedback';
                            feedbackDiv.innerHTML = `Nível de Incômodo: <span class="slider-value">0</span> <span class="slider-legend">${sliderLegends[0]}</span>`;
                            // 6. Adiciona o "ouvinte" de evento DIRETAMENTE no elemento que acabamos de criar
                            sliderInput.addEventListener('input', {
                                "FerramentaIrritacao.useEffect.inicializarFerramenta.renderQuestionsAsCarousel": (e)=>{
                                    const currentValue = e.target.value;
                                    // Agora procuramos o feedback a partir do sliderContainer, que sabemos que existe
                                    const valueSpan = sliderContainer.querySelector('.slider-value');
                                    const legendSpan = sliderContainer.querySelector('.slider-legend');
                                    if (valueSpan) valueSpan.textContent = currentValue;
                                    if (legendSpan) legendSpan.innerHTML = sliderLegends[currentValue];
                                }
                            }["FerramentaIrritacao.useEffect.inicializarFerramenta.renderQuestionsAsCarousel"]);
                            // 7. Monta o quebra-cabeça: aninha os elementos
                            sliderContainer.appendChild(sliderInput);
                            sliderContainer.appendChild(feedbackDiv);
                            card.appendChild(questionText);
                            card.appendChild(sliderContainer);
                            // 8. Adiciona o card completo ao palco do carrossel
                            carouselStage.appendChild(card);
                        }
                    }["FerramentaIrritacao.useEffect.inicializarFerramenta.renderQuestionsAsCarousel"]);
                }
                function updateCarousel() {
                    // Garante que os elementos existem antes de tentar usá-los
                    if (!carouselStage || !counterEl || !prevBtn || !nextBtn || !mainContinueBtn || !carouselNav) return;
                    const offset = -currentQuestionIndex * (100 / questions.length);
                    carouselStage.style.transform = `translateX(${offset}%)`;
                    counterEl.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
                    prevBtn.disabled = currentQuestionIndex === 0;
                    nextBtn.disabled = currentQuestionIndex === questions.length - 1;
                    // Mostra o botão principal de continuar apenas no último slide
                    if (currentQuestionIndex === questions.length - 1) {
                        mainContinueBtn.classList.remove('hidden');
                        carouselNav.classList.add('hidden'); // Esconde a navegação do carrossel
                    } else {
                        mainContinueBtn.classList.add('hidden');
                        carouselNav.classList.remove('hidden');
                    }
                }
                if (nextBtn) {
                    nextBtn.addEventListener('click', {
                        "FerramentaIrritacao.useEffect.inicializarFerramenta": ()=>{
                            if (currentQuestionIndex < questions.length - 1) {
                                currentQuestionIndex++;
                                updateCarousel();
                            }
                        }
                    }["FerramentaIrritacao.useEffect.inicializarFerramenta"]);
                }
                if (prevBtn) {
                    prevBtn.addEventListener('click', {
                        "FerramentaIrritacao.useEffect.inicializarFerramenta": ()=>{
                            if (currentQuestionIndex > 0) {
                                currentQuestionIndex--;
                                updateCarousel();
                            }
                        }
                    }["FerramentaIrritacao.useEffect.inicializarFerramenta"]);
                }
                document.body.addEventListener('click', {
                    "FerramentaIrritacao.useEffect.inicializarFerramenta": (e)=>{
                        const target = e.target;
                        if (target.id === 'goto-step2-btn') {
                            userResponses.respostas = {};
                            questions.forEach({
                                "FerramentaIrritacao.useEffect.inicializarFerramenta": (q)=>{
                                    const slider = document.querySelector(`.slider-container[data-question-id="${q.id}"] .irritation-slider`);
                                    if (slider) {
                                        userResponses.respostas[q.id] = parseInt(slider.value, 10);
                                    }
                                }
                            }["FerramentaIrritacao.useEffect.inicializarFerramenta"]);
                            document.getElementById('step1').classList.remove('active');
                            document.getElementById('step2').classList.add('active');
                            window.scrollTo(0, 0);
                        }
                        if (target.id === 'goto-step3-btn') {
                            // Lógica da Etapa 2 para 3 (sem alterações)
                            const reflection1 = document.getElementById('reflection1').value;
                            const reflection2 = document.getElementById('reflection2').value;
                            const reflection3 = document.getElementById('reflection3').value;
                            if (!reflection1 || !reflection2 || !reflection3) {
                                alert('Por favor, preencha todas as perguntas de reflexão para continuar.');
                                return;
                            }
                            userResponses.reflexao = {
                                comoFoi: reflection1,
                                metafora: reflection2,
                                mudancaEsperada: reflection3,
                                notaReflexao: document.getElementById('reflection-scale').value
                            };
                            const r = userResponses.respostas;
                            const scores = {
                                'Injustiça': (r.q1 || 0) + (r.q5 || 0) + (r.q11 || 0),
                                'Frustração': (r.q2 || 0) + (r.q6 || 0) + (r.q9 || 0),
                                'Cansaço': (r.q3 || 0) + (r.q7 || 0) + (r.q12 || 0),
                                'Medo do Julgamento': (r.q4 || 0) + (r.q8 || 0) + (r.q10 || 0)
                            };
                            const total = Object.values(scores).reduce({
                                "FerramentaIrritacao.useEffect.inicializarFerramenta.total": (a, b)=>a + b
                            }["FerramentaIrritacao.useEffect.inicializarFerramenta.total"], 0);
                            const sortedScores = Object.entries(scores).sort({
                                "FerramentaIrritacao.useEffect.inicializarFerramenta.sortedScores": ([, a], [, b])=>b - a
                            }["FerramentaIrritacao.useEffect.inicializarFerramenta.sortedScores"]);
                            const topGatilho = sortedScores[0][0];
                            const topScore = sortedScores[0][1];
                            const scoreClass = {
                                "FerramentaIrritacao.useEffect.inicializarFerramenta.scoreClass": (score)=>score >= 9 ? 'Alto' : score >= 5 ? 'Moderado' : 'Baixo'
                            }["FerramentaIrritacao.useEffect.inicializarFerramenta.scoreClass"];
                            const diagnosisReport = document.getElementById('diagnosis-report');
                            if (diagnosisReport) {
                                diagnosisReport.innerHTML = `<p>Seu gatilho dominante parece ser o de <strong>${topGatilho}</strong>, com uma pontuação de <strong>${topScore}</strong> (Nível ${scoreClass(topScore)}).</p><p>Sua reatividade geral está em <strong>${total}</strong> de 48.</p>`;
                            }
                            document.getElementById('step2').classList.remove('active');
                            document.getElementById('step3').classList.add('active');
                            window.scrollTo(0, 0);
                        }
                        if (target.id === 'send-report-btn') {
                            // Lógica de envio final (sem alterações)
                            const nomeInput = document.getElementById('user-name');
                            const emailInput = document.getElementById('user-email');
                            if (!nomeInput.value || !emailInput.value) {
                                alert('Por favor, preencha seu nome e e-mail para receber o relatório.');
                                return;
                            }
                            userResponses.nome = nomeInput.value;
                            userResponses.email = emailInput.value;
                            userResponses.whatsapp = document.getElementById('user-whatsapp').value;
                            userResponses.querBrinde = document.getElementById('wants-gift').checked;
                            document.dispatchEvent(new CustomEvent('showProgress'));
                            const webAppUrl = 'https://script.google.com/macros/s/AKfycbyZ3-z22JopJar4BWi7iSzAruNBVX-sZTJSaihfK2OGyCuorHgF-3SjdVU40fPitdRU/exec';
                            fetch(webAppUrl, {
                                method: 'POST',
                                mode: 'no-cors',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(userResponses)
                            }).then({
                                "FerramentaIrritacao.useEffect.inicializarFerramenta": ()=>{
                                    document.dispatchEvent(new CustomEvent('showSuccess'));
                                }
                            }["FerramentaIrritacao.useEffect.inicializarFerramenta"]).catch({
                                "FerramentaIrritacao.useEffect.inicializarFerramenta": (error)=>{
                                    console.error('Falha de rede na requisição:', error);
                                    alert('Ocorreu um erro de conexão. Verifique sua internet e tente novamente.');
                                }
                            }["FerramentaIrritacao.useEffect.inicializarFerramenta"]);
                        }
                    }
                }["FerramentaIrritacao.useEffect.inicializarFerramenta"]);
                renderQuestionsAsCarousel();
                updateCarousel();
            }
            inicializarFerramenta();
        }
    }["FerramentaIrritacao.useEffect"], []); // O array vazio [] faz o código rodar uma vez.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 214,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    id: "step1",
                    className: "step active",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "Responda às 12 situações abaixo:"
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 218,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "instructions-box",
                            children: "Para cada situação, use o controle deslizante para indicar seu nível de incômodo, de 0 (nenhum) a 4 (máximo)."
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 219,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "carousel-container",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "carousel-stage"
                            }, void 0, false, {
                                fileName: "[project]/pages/irritacao/index.js",
                                lineNumber: 223,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 222,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "carousel-navigation",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    id: "carousel-prev",
                                    className: "secondary-btn",
                                    disabled: true,
                                    children: "← Anterior"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 227,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    id: "carousel-counter",
                                    children: "1 / 12"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 228,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    id: "carousel-next",
                                    className: "secondary-btn",
                                    children: "Próximo →"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 229,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 226,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: "goto-step2-btn",
                            className: "primary-btn",
                            children: "Enviar Respostas e Continuar"
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 231,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 217,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    id: "step2",
                    className: "step",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "congrats-message",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "🎉 Parabéns! 🎉"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 237,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: [
                                        "Sua Autoavaliação foi",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 238,
                                            columnNumber: 50
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: "🥇 Concluída. 🥇"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 238,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 238,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "O passo mais difícil é sempre o primeiro, e você acaba de completá-lo. A maioria das pessoas evita olhar para o que as incomoda. O fato de você ter respondido a estas perguntas já te coloca em um grupo seleto que decidiu parar de reagir no piloto automático e começar a assumir o controle."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 239,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Essa jornada de autoconhecimento é um ato de coragem."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 240,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 236,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {}, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 242,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "reflection-questions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Antes de ver seu resultado, um convite para uma breve reflexão."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 244,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Suas respostas aqui são confidenciais e me ajudarão a entender ainda melhor o seu momento."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 245,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "reflection1",
                                            children: "Como foi, para você, parar e refletir sobre estas situações ao responder o teste?*"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 248,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            id: "reflection1",
                                            rows: "3",
                                            placeholder: "Seja honesto, não há resposta certa ou errada..."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 249,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 247,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "reflection2",
                                            children: 'Se você pudesse dar um nome ou usar uma metáfora para descrever o que você sente no exato momento em que a raiva assume o controle, qual seria? (Ex: "Uma onda que me arrasta", "Um curto-circuito na mente").*'
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 252,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            id: "reflection2",
                                            rows: "3",
                                            placeholder: "Qual é a sua metáfora?"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 253,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 251,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "reflection3",
                                            children: "Ao buscar entender seu gatilho com este teste, qual é a principal mudança que você espera ver em sua vida?*"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 256,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            id: "reflection3",
                                            rows: "3",
                                            placeholder: "O que você espera alcançar?"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 257,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 255,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "reflection-scale",
                                            children: "Por fim, em uma escala de 0 a 10, o quanto esta pesquisa te ajudou a refletir sobre suas próprias reações?*"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 260,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "slider-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "0",
                                                    max: "10",
                                                    defaultValue: "5",
                                                    className: "reflection-slider",
                                                    id: "reflection-scale"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/irritacao/index.js",
                                                    lineNumber: 262,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "slider-value",
                                                    children: "5"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/irritacao/index.js",
                                                    lineNumber: 263,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 261,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 259,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 243,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: "goto-step3-btn",
                            className: "primary-btn",
                            children: "Ver Meu Resultado Preliminar"
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 267,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 235,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    id: "step3",
                    className: "step",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "Seu Diagnóstico Preliminar"
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 271,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "diagnosis-report"
                        }, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 272,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {}, void 0, false, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 273,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "email-form",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Receba seu relatório completo e um plano de ação."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 275,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Para receber a análise detalhada e o plano de ação no seu e-mail, preencha os campos abaixo."
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 276,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    id: "user-name",
                                    placeholder: "Seu nome*"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 277,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    id: "user-email",
                                    placeholder: "Seu melhor e-mail*"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 278,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "tel",
                                    id: "user-whatsapp",
                                    placeholder: "Seu WhatsApp (Opcional)"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 279,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "gift-option",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            id: "wants-gift"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 282,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "wants-gift",
                                            children: "Quero receber um presente!"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/irritacao/index.js",
                                            lineNumber: 283,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 281,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    id: "send-report-btn",
                                    className: "primary-btn",
                                    children: "Quero Receber Meu Relatório"
                                }, void 0, false, {
                                    fileName: "[project]/pages/irritacao/index.js",
                                    lineNumber: 286,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/irritacao/index.js",
                            lineNumber: 274,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 270,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Modals$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 290,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Copyright$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/pages/irritacao/index.js",
                    lineNumber: 291,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/irritacao/index.js",
            lineNumber: 213,
            columnNumber: 13
        }, this)
    }, void 0, false);
}
_s(FerramentaIrritacao, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = FerramentaIrritacao;
var _c;
__turbopack_context__.k.register(_c, "FerramentaIrritacao");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/irritacao/index.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/irritacao";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/irritacao/index.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/irritacao/index.js\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/irritacao/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__97be2f75._.js.map