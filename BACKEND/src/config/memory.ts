import {LibSQLStore} from '@mastra/libsql'
import {Memory} from '@mastra/memory';
import { resolve} from 'node:path';

const dbPath = resolve(process.cwd(),"mastra.db")

export const memoryStore = new LibSQLStore({
    id:'meeting-assistant-memory',
    url:`file:${dbPath}`,
})
///memory of the agent
///Configuration for working memory feature. Can be { enabled: boolean; template?: string; schema?: ZodObject<any> | JSONSchema7; scope?: 'thread' | 'resource' } or { enabled: boolean } to disable.
export function createAgentMemory(){
    return new Memory({
        storage : memoryStore,
        options :{
            lastMessages :20,
            workingMemory :{
                enabled : true,
                scope : "resource",
                template:`#meeting preference
                - Timezone:
                - Default meeting length (minutes)
                - Preferred meeting hourse:
                - Notes`
            }
        }
    })
}