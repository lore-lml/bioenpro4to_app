/* tslint:disable */
/* eslint-disable */
/**
*/
export function greet(): void;
/**
*/
export class ChannelInfo {
  free(): void;
/**
* @param {string} channel_id
* @param {string} announce_id
*/
  constructor(channel_id: string, announce_id: string);
/**
* @returns {string}
*/
  channel_id(): string;
/**
* @returns {string}
*/
  announce_id(): string;
}
/**
*/
export class ChannelReader {
  free(): void;
/**
* @returns {ChannelReaderBuilder}
*/
  static builder(): ChannelReaderBuilder;
/**
* @returns {ChannelReader}
*/
  clone(): ChannelReader;
/**
*
* Attach the Reader to Channel
* @returns {any}
*/
  attach(): any;
/**
*
* Fetch all the remaining msgs
*
* # Return Value
* It returns a Vector of Tuple containing (msg_id, public_bytes, masked_bytes)
* @returns {any}
*/
  fetch_raw_msgs(): any;
/**
* @param {KeyNonce | undefined} key_nonce
* @returns {ResponseMessage}
*/
  pop_msg(key_nonce?: KeyNonce): ResponseMessage;
/**
* @returns {boolean}
*/
  has_next_msg(): boolean;
/**
* @returns {ChannelInfo}
*/
  channel_address(): ChannelInfo;
/**
*
* Get the index of msg to find the transaction on the tangle
* @param {string} msg_id
* @returns {string}
*/
  msg_index(msg_id: string): string;
/**
* @param {string} psw
* @returns {EncryptedState}
*/
  export_to_bytes(psw: string): EncryptedState;
/**
* @param {EncryptedState} state
* @param {string} psw
* @param {string | undefined} node_url
* @returns {ChannelReader}
*/
  static import_from_bytes(state: EncryptedState, psw: string, node_url?: string): ChannelReader;
}
/**
*/
export class ChannelReaderBuilder {
  free(): void;
/**
*/
  constructor();
/**
* @param {string} seed
* @returns {ChannelReaderBuilder}
*/
  seed(seed: string): ChannelReaderBuilder;
/**
* @param {string} node_url
* @returns {ChannelReaderBuilder}
*/
  node(node_url: string): ChannelReaderBuilder;
/**
* @param {string} channel_id
* @param {string} announce_id
* @returns {ChannelReader}
*/
  build(channel_id: string, announce_id: string): ChannelReader;
}
/**
*/
export class EncryptedState {
  free(): void;
}
/**
*/
export class KeyNonce {
  free(): void;
/**
* @param {string} key
* @param {string} nonce
*/
  constructor(key: string, nonce: string);
/**
* @returns {KeyNonce}
*/
  clone(): KeyNonce;
/**
* @returns {Uint8Array}
*/
  readonly key: Uint8Array;
/**
* @returns {Uint8Array}
*/
  readonly nonce: Uint8Array;
}
/**
*/
export class ResponseMessage {
  free(): void;
/**
* @returns {Uint8Array}
*/
  readonly masked: Uint8Array;
/**
* @returns {string}
*/
  readonly msg_id: string;
/**
* @returns {Uint8Array}
*/
  readonly public: Uint8Array;
}
