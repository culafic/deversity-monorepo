import { Global, Inject, Injectable } from '@nestjs/common';
import PouchDB from 'pouchdb';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as PouchDBAdapterMemory from 'pouchdb-adapter-memory';

PouchDB.plugin(require('pouchdb-adapter-memory'));

//PouchDB.plugin(PouchDBAdapterMemory);
@Global()
@Injectable()
export class SagaService {
  #db: PouchDB.Database;
  placeholder: any;
  constructor(
    @Inject('SAGA_STORE_OPTIONS')
    private readonly sagaOptions: any
  ) {
    console.log('sagaOptions', this.sagaOptions);
    const placeholder = new PouchDB('SagaDB', { adapter: 'memory' });
    this.#db = placeholder;
  }

  public async set(record: any) {
    return this.#db.post(record);
  }

  public async get<T>(id: string) {
    console.log('ID ', id);
    try {
      return this.#db.get<T>(id);
    } catch (error) {
      console.log('error ', error);
      return error;
    }
  }

  public async put(record: any) {
    return this.#db.put(record);
  }

  public async makeSaga(saga: any) {
    console.log('SAGA');
    try {
      return this.#db.post(saga);
    } catch (error) {
      console.log('ERROR ', error);
      return error;
    }
  }
  public async upadateSaga(saga: any, record: any) {
    return this.#db.put({ ...saga, messageChain: record });
  }
}
