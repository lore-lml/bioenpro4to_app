import * as wasm from './iota_streams_wasm_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_28(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h22205dcaedbf07da(arg0, arg1, addHeapObject(arg2));
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
function __wbg_adapter_99(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__hf1d412c18306105a(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export class ChannelInfo {

    static __wrap(ptr) {
        const obj = Object.create(ChannelInfo.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_channelinfo_free(ptr);
    }
    /**
    * @param {string} channel_id
    * @param {string} announce_id
    */
    constructor(channel_id, announce_id) {
        var ptr0 = passStringToWasm0(channel_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(announce_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.channelinfo_new(ptr0, len0, ptr1, len1);
        return ChannelInfo.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    channel_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.channelinfo_channel_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    announce_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.channelinfo_announce_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class ChannelReader {

    static __wrap(ptr) {
        const obj = Object.create(ChannelReader.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_channelreader_free(ptr);
    }
    /**
    * @returns {ChannelReader}
    */
    clone() {
        var ret = wasm.channelreader_clone(this.ptr);
        return ChannelReader.__wrap(ret);
    }
    /**
    *
    * Attach the Reader to Channel
    * @returns {any}
    */
    attach() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.channelreader_attach(ptr);
        return takeObject(ret);
    }
    /**
    *
    * Fetch all the remaining msgs
    *
    * # Return Value
    * It returns a Vector of Tuple containing (msg_id, public_bytes, masked_bytes)
    * @returns {any}
    */
    fetch_raw_msgs() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.channelreader_fetch_raw_msgs(ptr);
        return takeObject(ret);
    }
    /**
    * @param {KeyNonce | undefined} key_nonce
    * @returns {ResponseMessage}
    */
    pop_msg(key_nonce) {
        let ptr0 = 0;
        if (!isLikeNone(key_nonce)) {
            _assertClass(key_nonce, KeyNonce);
            ptr0 = key_nonce.ptr;
            key_nonce.ptr = 0;
        }
        var ret = wasm.channelreader_pop_msg(this.ptr, ptr0);
        return ResponseMessage.__wrap(ret);
    }
    /**
    * @returns {boolean}
    */
    has_next_msg() {
        var ret = wasm.channelreader_has_next_msg(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {ChannelInfo}
    */
    channel_address() {
        var ret = wasm.channelreader_channel_address(this.ptr);
        return ChannelInfo.__wrap(ret);
    }
    /**
    *
    * Get the index of msg to find the transaction on the tangle
    * @param {string} msg_id
    * @returns {string}
    */
    msg_index(msg_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(msg_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.channelreader_msg_index(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class ChannelReaderBuilder {

    static __wrap(ptr) {
        const obj = Object.create(ChannelReaderBuilder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_channelreaderbuilder_free(ptr);
    }
    /**
    */
    constructor() {
        var ret = wasm.channelreaderbuilder_new();
        return ChannelReaderBuilder.__wrap(ret);
    }
    /**
    * @param {string} seed
    * @returns {ChannelReaderBuilder}
    */
    seed(seed) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.channelreaderbuilder_seed(ptr, ptr0, len0);
        return ChannelReaderBuilder.__wrap(ret);
    }
    /**
    * @param {string} node_url
    * @returns {ChannelReaderBuilder}
    */
    node(node_url) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(node_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.channelreaderbuilder_node(ptr, ptr0, len0);
        return ChannelReaderBuilder.__wrap(ret);
    }
    /**
    * @param {string} encoding
    * @returns {ChannelReaderBuilder}
    */
    encoding(encoding) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(encoding, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.channelreaderbuilder_encoding(ptr, ptr0, len0);
        return ChannelReaderBuilder.__wrap(ret);
    }
    /**
    * @param {string} channel_id
    * @param {string} announce_id
    * @returns {ChannelReader}
    */
    build(channel_id, announce_id) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(channel_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(announce_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.channelreaderbuilder_build(ptr, ptr0, len0, ptr1, len1);
        return ChannelReader.__wrap(ret);
    }
}
/**
*/
export class ChannelWriter {

    static __wrap(ptr) {
        const obj = Object.create(ChannelWriter.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_channelwriter_free(ptr);
    }
    /**
    * @returns {ChannelWriter}
    */
    clone() {
        var ret = wasm.channelwriter_clone(this.ptr);
        return ChannelWriter.__wrap(ret);
    }
    /**
    * @returns {any}
    */
    open() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.channelwriter_open(ptr);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} p_data
    * @param {Uint8Array} m_data
    * @param {KeyNonce | undefined} key_nonce
    * @returns {any}
    */
    send_signed_raw_data(p_data, m_data, key_nonce) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passArray8ToWasm0(p_data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray8ToWasm0(m_data, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        let ptr2 = 0;
        if (!isLikeNone(key_nonce)) {
            _assertClass(key_nonce, KeyNonce);
            ptr2 = key_nonce.ptr;
            key_nonce.ptr = 0;
        }
        var ret = wasm.channelwriter_send_signed_raw_data(ptr, ptr0, len0, ptr1, len1, ptr2);
        return takeObject(ret);
    }
    /**
    * @returns {ChannelInfo}
    */
    channel_address() {
        var ret = wasm.channelwriter_channel_address(this.ptr);
        return ChannelInfo.__wrap(ret);
    }
    /**
    * @param {string} msg_id
    * @returns {string}
    */
    msg_index(msg_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(msg_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.channelwriter_msg_index(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class ChannelWriterBuilder {

    static __wrap(ptr) {
        const obj = Object.create(ChannelWriterBuilder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_channelwriterbuilder_free(ptr);
    }
    /**
    */
    constructor() {
        var ret = wasm.channelwriterbuilder_new();
        return ChannelWriterBuilder.__wrap(ret);
    }
    /**
    * @param {string} seed
    * @returns {ChannelWriterBuilder}
    */
    seed(seed) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.channelwriterbuilder_seed(ptr, ptr0, len0);
        return ChannelWriterBuilder.__wrap(ret);
    }
    /**
    * @param {string} node_url
    * @returns {ChannelWriterBuilder}
    */
    node(node_url) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(node_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.channelwriterbuilder_node(ptr, ptr0, len0);
        return ChannelWriterBuilder.__wrap(ret);
    }
    /**
    * @param {string} encoding
    * @returns {ChannelWriterBuilder}
    */
    encoding(encoding) {
        const ptr = this.__destroy_into_raw();
        var ptr0 = passStringToWasm0(encoding, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.channelwriterbuilder_encoding(ptr, ptr0, len0);
        return ChannelWriterBuilder.__wrap(ret);
    }
    /**
    * @returns {ChannelWriter}
    */
    build() {
        const ptr = this.__destroy_into_raw();
        var ret = wasm.channelwriterbuilder_build(ptr);
        return ChannelWriter.__wrap(ret);
    }
}
/**
*/
export class KeyNonce {

    static __wrap(ptr) {
        const obj = Object.create(KeyNonce.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keynonce_free(ptr);
    }
    /**
    * @param {string} key
    * @param {string} nonce
    */
    constructor(key, nonce) {
        var ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(nonce, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.keynonce_new(ptr0, len0, ptr1, len1);
        return KeyNonce.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    get key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keynonce_key(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    get nonce() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keynonce_nonce(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {KeyNonce}
    */
    clone() {
        var ret = wasm.keynonce_clone(this.ptr);
        return KeyNonce.__wrap(ret);
    }
}
/**
*/
export class ResponseMessage {

    static __wrap(ptr) {
        const obj = Object.create(ResponseMessage.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_responsemessage_free(ptr);
    }
    /**
    * @returns {string}
    */
    get msg_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.responsemessage_msg_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    get public() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.responsemessage_public(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    get masked() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.responsemessage_masked(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_string_new(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbg_channelinfo_new(arg0) {
    var ret = ChannelInfo.__wrap(arg0);
    return addHeapObject(ret);
};

export function __wbg_self_f865985e662246aa() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_require_c59851dfa0dc7e78() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_crypto_bfb05100db79193b(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

export function __wbg_msCrypto_f6dddc6ae048b7e2(arg0) {
    var ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

export function __wbindgen_is_undefined(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg_newwithlength_a8d1dbcbe703a5c6(arg0) {
    var ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_static_accessor_MODULE_39947eb3fe77895f() {
    var ret = module;
    return addHeapObject(ret);
};

export function __wbg_new_edbe38a4e21329dd() {
    var ret = new Object();
    return addHeapObject(ret);
};

export function __wbg_new_80e79fe6852cbe9c() { return handleError(function () {
    var ret = new Headers();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_append_441dc2c4b2281095() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbindgen_object_clone_ref(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_memory() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

export function __wbg_buffer_9e184d6f785de5ed(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export function __wbg_newwithbyteoffsetandlength_e57ad1f2ce812c03(arg0, arg1, arg2) {
    var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_new_e8101319e4cf95fc(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_newwithstrandinit_155cb1478824b198() { return handleError(function (arg0, arg1, arg2) {
    var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_has_9fa0c068863afd36() { return handleError(function (arg0, arg1) {
    var ret = Reflect.has(getObject(arg0), getObject(arg1));
    return ret;
}, arguments) };

export function __wbg_fetch_9dbf87b840590e85(arg0, arg1) {
    var ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_fetch_01d048dd000bcda1(arg0) {
    var ret = fetch(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_instanceof_Response_d61ff4c524b8dbc4(arg0) {
    var ret = getObject(arg0) instanceof Response;
    return ret;
};

export function __wbg_status_1a7d875f6e1318cd(arg0) {
    var ret = getObject(arg0).status;
    return ret;
};

export function __wbg_url_0ffe73d78f393423(arg0, arg1) {
    var ret = getObject(arg1).url;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_headers_f49eca784c8ebeba(arg0) {
    var ret = getObject(arg0).headers;
    return addHeapObject(ret);
};

export function __wbg_iterator_30586bd3e46ee10e() {
    var ret = Symbol.iterator;
    return addHeapObject(ret);
};

export function __wbg_get_800098c980b31ea2() { return handleError(function (arg0, arg1) {
    var ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_function(arg0) {
    var ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

export function __wbg_call_ba36642bd901572b() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    var ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbg_next_e38a92137a5693de(arg0) {
    var ret = getObject(arg0).next;
    return addHeapObject(ret);
};

export function __wbindgen_json_serialize(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = JSON.stringify(obj === undefined ? null : obj);
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_arrayBuffer_b7c95af83e1e2705() { return handleError(function (arg0) {
    var ret = getObject(arg0).arrayBuffer();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_length_2d56cb37075fcfb1(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

export function __wbg_text_7c3304aebfcffa1a() { return handleError(function (arg0) {
    var ret = getObject(arg0).text();
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_new0_85024d5e91a046e9() {
    var ret = new Date();
    return addHeapObject(ret);
};

export function __wbg_getTime_55dfad3366aec58a(arg0) {
    var ret = getObject(arg0).getTime();
    return ret;
};

export function __wbg_new_c143a4f563f78c4e(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_99(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        var ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_next_8b73f854755d8e5e() { return handleError(function (arg0) {
    var ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_done_86efa5ac73f5b194(arg0) {
    var ret = getObject(arg0).done;
    return ret;
};

export function __wbg_value_708ce1aa93862729(arg0) {
    var ret = getObject(arg0).value;
    return addHeapObject(ret);
};

export function __wbg_self_bb69a836a72ec6e9() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_window_3304fc4b414c9693() { return handleError(function () {
    var ret = window.window;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_globalThis_e0d21cabc6630763() { return handleError(function () {
    var ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_global_8463719227271676() { return handleError(function () {
    var ret = global.global;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_newnoargs_9fdd8f3961dd1bee(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_call_3fc07b7d5fc9022d() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_set_e8ae7b27314e8b98(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export function __wbg_set_73349fc4814e0fc6() { return handleError(function (arg0, arg1, arg2) {
    var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };

export function __wbg_subarray_901ede8318da52a6(arg0, arg1, arg2) {
    var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_getRandomValues_57e4008f45f0e105() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

export function __wbg_randomFillSync_d90848a552cbd666() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
}, arguments) };

export function __wbindgen_debug_string(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_rethrow(arg0) {
    throw takeObject(arg0);
};

export function __wbg_then_c2361a9d5c9a4fcb(arg0, arg1) {
    var ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_then_6c9a4bf55755f9b8(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export function __wbindgen_cb_drop(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};

export function __wbg_resolve_cae3d8f752f5db88(arg0) {
    var ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper3583(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 132, __wbg_adapter_28);
    return addHeapObject(ret);
};

