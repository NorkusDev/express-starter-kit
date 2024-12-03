import express from 'express'

import { User } from "../../database/models/user-model";

// export{}

// declare global {
//     namespace Express {
//         export interface Request {
//             user? : {
//                 id?: number
//             }
//         }
//     }
// }

interface ReqUser {
    id : number,
}

declare global {
    namespace Express {
    export interface Request {
        user: ReqUser;
    }
    export interface Response {
        user: any;
    }
  }
}