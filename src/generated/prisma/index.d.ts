
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model UsageRecord
 * 
 */
export type UsageRecord = $Result.DefaultSelection<Prisma.$UsageRecordPayload>
/**
 * Model Invoice
 * 
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model LLMConversation
 * 
 */
export type LLMConversation = $Result.DefaultSelection<Prisma.$LLMConversationPayload>
/**
 * Model LLMMessage
 * 
 */
export type LLMMessage = $Result.DefaultSelection<Prisma.$LLMMessagePayload>
/**
 * Model SharedAnalysis
 * 
 */
export type SharedAnalysis = $Result.DefaultSelection<Prisma.$SharedAnalysisPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const SubscriptionTier: {
  FREE: 'FREE',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE'
};

export type SubscriptionTier = (typeof SubscriptionTier)[keyof typeof SubscriptionTier]


export const UsageAction: {
  EXTRACT_PDF: 'EXTRACT_PDF',
  ROAST_ANALYSIS: 'ROAST_ANALYSIS',
  COVER_LETTER_GENERATION: 'COVER_LETTER_GENERATION'
};

export type UsageAction = (typeof UsageAction)[keyof typeof UsageAction]


export const InvoiceStatus: {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]


export const ConversationType: {
  RESUME_ANALYSIS: 'RESUME_ANALYSIS',
  JOB_EXTRACTION: 'JOB_EXTRACTION',
  COVER_LETTER_GENERATION: 'COVER_LETTER_GENERATION',
  PDF_EXTRACTION: 'PDF_EXTRACTION',
  GENERAL_CHAT: 'GENERAL_CHAT'
};

export type ConversationType = (typeof ConversationType)[keyof typeof ConversationType]


export const ConversationStatus: {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type ConversationStatus = (typeof ConversationStatus)[keyof typeof ConversationStatus]


export const MessageRole: {
  USER: 'USER',
  ASSISTANT: 'ASSISTANT',
  SYSTEM: 'SYSTEM'
};

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole]

}

export type SubscriptionTier = $Enums.SubscriptionTier

export const SubscriptionTier: typeof $Enums.SubscriptionTier

export type UsageAction = $Enums.UsageAction

export const UsageAction: typeof $Enums.UsageAction

export type InvoiceStatus = $Enums.InvoiceStatus

export const InvoiceStatus: typeof $Enums.InvoiceStatus

export type ConversationType = $Enums.ConversationType

export const ConversationType: typeof $Enums.ConversationType

export type ConversationStatus = $Enums.ConversationStatus

export const ConversationStatus: typeof $Enums.ConversationStatus

export type MessageRole = $Enums.MessageRole

export const MessageRole: typeof $Enums.MessageRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usageRecord`: Exposes CRUD operations for the **UsageRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsageRecords
    * const usageRecords = await prisma.usageRecord.findMany()
    * ```
    */
  get usageRecord(): Prisma.UsageRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lLMConversation`: Exposes CRUD operations for the **LLMConversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LLMConversations
    * const lLMConversations = await prisma.lLMConversation.findMany()
    * ```
    */
  get lLMConversation(): Prisma.LLMConversationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lLMMessage`: Exposes CRUD operations for the **LLMMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LLMMessages
    * const lLMMessages = await prisma.lLMMessage.findMany()
    * ```
    */
  get lLMMessage(): Prisma.LLMMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sharedAnalysis`: Exposes CRUD operations for the **SharedAnalysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SharedAnalyses
    * const sharedAnalyses = await prisma.sharedAnalysis.findMany()
    * ```
    */
  get sharedAnalysis(): Prisma.SharedAnalysisDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Account: 'Account',
    Session: 'Session',
    Document: 'Document',
    UsageRecord: 'UsageRecord',
    Invoice: 'Invoice',
    LLMConversation: 'LLMConversation',
    LLMMessage: 'LLMMessage',
    SharedAnalysis: 'SharedAnalysis'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "account" | "session" | "document" | "usageRecord" | "invoice" | "lLMConversation" | "lLMMessage" | "sharedAnalysis"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      UsageRecord: {
        payload: Prisma.$UsageRecordPayload<ExtArgs>
        fields: Prisma.UsageRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsageRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsageRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload>
          }
          findFirst: {
            args: Prisma.UsageRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsageRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload>
          }
          findMany: {
            args: Prisma.UsageRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload>[]
          }
          create: {
            args: Prisma.UsageRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload>
          }
          createMany: {
            args: Prisma.UsageRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsageRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload>[]
          }
          delete: {
            args: Prisma.UsageRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload>
          }
          update: {
            args: Prisma.UsageRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload>
          }
          deleteMany: {
            args: Prisma.UsageRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsageRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsageRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload>[]
          }
          upsert: {
            args: Prisma.UsageRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageRecordPayload>
          }
          aggregate: {
            args: Prisma.UsageRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsageRecord>
          }
          groupBy: {
            args: Prisma.UsageRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsageRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsageRecordCountArgs<ExtArgs>
            result: $Utils.Optional<UsageRecordCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      LLMConversation: {
        payload: Prisma.$LLMConversationPayload<ExtArgs>
        fields: Prisma.LLMConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LLMConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LLMConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload>
          }
          findFirst: {
            args: Prisma.LLMConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LLMConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload>
          }
          findMany: {
            args: Prisma.LLMConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload>[]
          }
          create: {
            args: Prisma.LLMConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload>
          }
          createMany: {
            args: Prisma.LLMConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LLMConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload>[]
          }
          delete: {
            args: Prisma.LLMConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload>
          }
          update: {
            args: Prisma.LLMConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload>
          }
          deleteMany: {
            args: Prisma.LLMConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LLMConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LLMConversationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload>[]
          }
          upsert: {
            args: Prisma.LLMConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMConversationPayload>
          }
          aggregate: {
            args: Prisma.LLMConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLLMConversation>
          }
          groupBy: {
            args: Prisma.LLMConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LLMConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LLMConversationCountArgs<ExtArgs>
            result: $Utils.Optional<LLMConversationCountAggregateOutputType> | number
          }
        }
      }
      LLMMessage: {
        payload: Prisma.$LLMMessagePayload<ExtArgs>
        fields: Prisma.LLMMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LLMMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LLMMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload>
          }
          findFirst: {
            args: Prisma.LLMMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LLMMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload>
          }
          findMany: {
            args: Prisma.LLMMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload>[]
          }
          create: {
            args: Prisma.LLMMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload>
          }
          createMany: {
            args: Prisma.LLMMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LLMMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload>[]
          }
          delete: {
            args: Prisma.LLMMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload>
          }
          update: {
            args: Prisma.LLMMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload>
          }
          deleteMany: {
            args: Prisma.LLMMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LLMMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LLMMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload>[]
          }
          upsert: {
            args: Prisma.LLMMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LLMMessagePayload>
          }
          aggregate: {
            args: Prisma.LLMMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLLMMessage>
          }
          groupBy: {
            args: Prisma.LLMMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<LLMMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.LLMMessageCountArgs<ExtArgs>
            result: $Utils.Optional<LLMMessageCountAggregateOutputType> | number
          }
        }
      }
      SharedAnalysis: {
        payload: Prisma.$SharedAnalysisPayload<ExtArgs>
        fields: Prisma.SharedAnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SharedAnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SharedAnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload>
          }
          findFirst: {
            args: Prisma.SharedAnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SharedAnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload>
          }
          findMany: {
            args: Prisma.SharedAnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload>[]
          }
          create: {
            args: Prisma.SharedAnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload>
          }
          createMany: {
            args: Prisma.SharedAnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SharedAnalysisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload>[]
          }
          delete: {
            args: Prisma.SharedAnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload>
          }
          update: {
            args: Prisma.SharedAnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload>
          }
          deleteMany: {
            args: Prisma.SharedAnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SharedAnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SharedAnalysisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload>[]
          }
          upsert: {
            args: Prisma.SharedAnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedAnalysisPayload>
          }
          aggregate: {
            args: Prisma.SharedAnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSharedAnalysis>
          }
          groupBy: {
            args: Prisma.SharedAnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<SharedAnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.SharedAnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<SharedAnalysisCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    account?: AccountOmit
    session?: SessionOmit
    document?: DocumentOmit
    usageRecord?: UsageRecordOmit
    invoice?: InvoiceOmit
    lLMConversation?: LLMConversationOmit
    lLMMessage?: LLMMessageOmit
    sharedAnalysis?: SharedAnalysisOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
    documents: number
    usageRecords: number
    invoices: number
    llmConversations: number
    sharedAnalyses: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    documents?: boolean | UserCountOutputTypeCountDocumentsArgs
    usageRecords?: boolean | UserCountOutputTypeCountUsageRecordsArgs
    invoices?: boolean | UserCountOutputTypeCountInvoicesArgs
    llmConversations?: boolean | UserCountOutputTypeCountLlmConversationsArgs
    sharedAnalyses?: boolean | UserCountOutputTypeCountSharedAnalysesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUsageRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageRecordWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLlmConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LLMConversationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSharedAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SharedAnalysisWhereInput
  }


  /**
   * Count Type DocumentCountOutputType
   */

  export type DocumentCountOutputType = {
    usageRecords: number
    llmConversations: number
  }

  export type DocumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usageRecords?: boolean | DocumentCountOutputTypeCountUsageRecordsArgs
    llmConversations?: boolean | DocumentCountOutputTypeCountLlmConversationsArgs
  }

  // Custom InputTypes
  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentCountOutputType
     */
    select?: DocumentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountUsageRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageRecordWhereInput
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountLlmConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LLMConversationWhereInput
  }


  /**
   * Count Type LLMConversationCountOutputType
   */

  export type LLMConversationCountOutputType = {
    messages: number
  }

  export type LLMConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | LLMConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * LLMConversationCountOutputType without action
   */
  export type LLMConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversationCountOutputType
     */
    select?: LLMConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LLMConversationCountOutputType without action
   */
  export type LLMConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LLMMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    monthlyRoasts: number | null
    totalRoasts: number | null
  }

  export type UserSumAggregateOutputType = {
    monthlyRoasts: number | null
    totalRoasts: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    emailVerified: Date | null
    image: string | null
    hashedPassword: string | null
    createdAt: Date | null
    updatedAt: Date | null
    subscriptionTier: $Enums.SubscriptionTier | null
    subscriptionId: string | null
    customerId: string | null
    subscriptionEndsAt: Date | null
    monthlyRoasts: number | null
    totalRoasts: number | null
    lastRoastReset: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    emailVerified: Date | null
    image: string | null
    hashedPassword: string | null
    createdAt: Date | null
    updatedAt: Date | null
    subscriptionTier: $Enums.SubscriptionTier | null
    subscriptionId: string | null
    customerId: string | null
    subscriptionEndsAt: Date | null
    monthlyRoasts: number | null
    totalRoasts: number | null
    lastRoastReset: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    emailVerified: number
    image: number
    hashedPassword: number
    createdAt: number
    updatedAt: number
    subscriptionTier: number
    subscriptionId: number
    customerId: number
    subscriptionEndsAt: number
    monthlyRoasts: number
    totalRoasts: number
    lastRoastReset: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    monthlyRoasts?: true
    totalRoasts?: true
  }

  export type UserSumAggregateInputType = {
    monthlyRoasts?: true
    totalRoasts?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    emailVerified?: true
    image?: true
    hashedPassword?: true
    createdAt?: true
    updatedAt?: true
    subscriptionTier?: true
    subscriptionId?: true
    customerId?: true
    subscriptionEndsAt?: true
    monthlyRoasts?: true
    totalRoasts?: true
    lastRoastReset?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    emailVerified?: true
    image?: true
    hashedPassword?: true
    createdAt?: true
    updatedAt?: true
    subscriptionTier?: true
    subscriptionId?: true
    customerId?: true
    subscriptionEndsAt?: true
    monthlyRoasts?: true
    totalRoasts?: true
    lastRoastReset?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    emailVerified?: true
    image?: true
    hashedPassword?: true
    createdAt?: true
    updatedAt?: true
    subscriptionTier?: true
    subscriptionId?: true
    customerId?: true
    subscriptionEndsAt?: true
    monthlyRoasts?: true
    totalRoasts?: true
    lastRoastReset?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    emailVerified: Date | null
    image: string | null
    hashedPassword: string | null
    createdAt: Date
    updatedAt: Date
    subscriptionTier: $Enums.SubscriptionTier
    subscriptionId: string | null
    customerId: string | null
    subscriptionEndsAt: Date | null
    monthlyRoasts: number
    totalRoasts: number
    lastRoastReset: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    emailVerified?: boolean
    image?: boolean
    hashedPassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subscriptionTier?: boolean
    subscriptionId?: boolean
    customerId?: boolean
    subscriptionEndsAt?: boolean
    monthlyRoasts?: boolean
    totalRoasts?: boolean
    lastRoastReset?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    documents?: boolean | User$documentsArgs<ExtArgs>
    usageRecords?: boolean | User$usageRecordsArgs<ExtArgs>
    invoices?: boolean | User$invoicesArgs<ExtArgs>
    llmConversations?: boolean | User$llmConversationsArgs<ExtArgs>
    sharedAnalyses?: boolean | User$sharedAnalysesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    emailVerified?: boolean
    image?: boolean
    hashedPassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subscriptionTier?: boolean
    subscriptionId?: boolean
    customerId?: boolean
    subscriptionEndsAt?: boolean
    monthlyRoasts?: boolean
    totalRoasts?: boolean
    lastRoastReset?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    emailVerified?: boolean
    image?: boolean
    hashedPassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subscriptionTier?: boolean
    subscriptionId?: boolean
    customerId?: boolean
    subscriptionEndsAt?: boolean
    monthlyRoasts?: boolean
    totalRoasts?: boolean
    lastRoastReset?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    emailVerified?: boolean
    image?: boolean
    hashedPassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subscriptionTier?: boolean
    subscriptionId?: boolean
    customerId?: boolean
    subscriptionEndsAt?: boolean
    monthlyRoasts?: boolean
    totalRoasts?: boolean
    lastRoastReset?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "emailVerified" | "image" | "hashedPassword" | "createdAt" | "updatedAt" | "subscriptionTier" | "subscriptionId" | "customerId" | "subscriptionEndsAt" | "monthlyRoasts" | "totalRoasts" | "lastRoastReset", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    documents?: boolean | User$documentsArgs<ExtArgs>
    usageRecords?: boolean | User$usageRecordsArgs<ExtArgs>
    invoices?: boolean | User$invoicesArgs<ExtArgs>
    llmConversations?: boolean | User$llmConversationsArgs<ExtArgs>
    sharedAnalyses?: boolean | User$sharedAnalysesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      documents: Prisma.$DocumentPayload<ExtArgs>[]
      usageRecords: Prisma.$UsageRecordPayload<ExtArgs>[]
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
      llmConversations: Prisma.$LLMConversationPayload<ExtArgs>[]
      sharedAnalyses: Prisma.$SharedAnalysisPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      emailVerified: Date | null
      image: string | null
      hashedPassword: string | null
      createdAt: Date
      updatedAt: Date
      subscriptionTier: $Enums.SubscriptionTier
      subscriptionId: string | null
      customerId: string | null
      subscriptionEndsAt: Date | null
      monthlyRoasts: number
      totalRoasts: number
      lastRoastReset: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    documents<T extends User$documentsArgs<ExtArgs> = {}>(args?: Subset<T, User$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    usageRecords<T extends User$usageRecordsArgs<ExtArgs> = {}>(args?: Subset<T, User$usageRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invoices<T extends User$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, User$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    llmConversations<T extends User$llmConversationsArgs<ExtArgs> = {}>(args?: Subset<T, User$llmConversationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sharedAnalyses<T extends User$sharedAnalysesArgs<ExtArgs> = {}>(args?: Subset<T, User$sharedAnalysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly hashedPassword: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly subscriptionTier: FieldRef<"User", 'SubscriptionTier'>
    readonly subscriptionId: FieldRef<"User", 'String'>
    readonly customerId: FieldRef<"User", 'String'>
    readonly subscriptionEndsAt: FieldRef<"User", 'DateTime'>
    readonly monthlyRoasts: FieldRef<"User", 'Int'>
    readonly totalRoasts: FieldRef<"User", 'Int'>
    readonly lastRoastReset: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.documents
   */
  export type User$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * User.usageRecords
   */
  export type User$usageRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    where?: UsageRecordWhereInput
    orderBy?: UsageRecordOrderByWithRelationInput | UsageRecordOrderByWithRelationInput[]
    cursor?: UsageRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsageRecordScalarFieldEnum | UsageRecordScalarFieldEnum[]
  }

  /**
   * User.invoices
   */
  export type User$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * User.llmConversations
   */
  export type User$llmConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    where?: LLMConversationWhereInput
    orderBy?: LLMConversationOrderByWithRelationInput | LLMConversationOrderByWithRelationInput[]
    cursor?: LLMConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LLMConversationScalarFieldEnum | LLMConversationScalarFieldEnum[]
  }

  /**
   * User.sharedAnalyses
   */
  export type User$sharedAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
    where?: SharedAnalysisWhereInput
    orderBy?: SharedAnalysisOrderByWithRelationInput | SharedAnalysisOrderByWithRelationInput[]
    cursor?: SharedAnalysisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SharedAnalysisScalarFieldEnum | SharedAnalysisScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires" | "createdAt" | "updatedAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentAvgAggregateOutputType = {
    originalSize: number | null
    wordCount: number | null
    pageCount: number | null
    extractionCost: number | null
    processingTime: number | null
  }

  export type DocumentSumAggregateOutputType = {
    originalSize: number | null
    wordCount: number | null
    pageCount: number | null
    extractionCost: number | null
    processingTime: number | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    filename: string | null
    originalSize: number | null
    fileHash: string | null
    mimeType: string | null
    extractedText: string | null
    wordCount: number | null
    pageCount: number | null
    aiProvider: string | null
    extractionCost: number | null
    summary: string | null
    processedAt: Date | null
    processingTime: number | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    filename: string | null
    originalSize: number | null
    fileHash: string | null
    mimeType: string | null
    extractedText: string | null
    wordCount: number | null
    pageCount: number | null
    aiProvider: string | null
    extractionCost: number | null
    summary: string | null
    processedAt: Date | null
    processingTime: number | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    userId: number
    filename: number
    originalSize: number
    fileHash: number
    mimeType: number
    extractedText: number
    wordCount: number
    pageCount: number
    aiProvider: number
    extractionCost: number
    summary: number
    sections: number
    processedAt: number
    processingTime: number
    _all: number
  }


  export type DocumentAvgAggregateInputType = {
    originalSize?: true
    wordCount?: true
    pageCount?: true
    extractionCost?: true
    processingTime?: true
  }

  export type DocumentSumAggregateInputType = {
    originalSize?: true
    wordCount?: true
    pageCount?: true
    extractionCost?: true
    processingTime?: true
  }

  export type DocumentMinAggregateInputType = {
    id?: true
    userId?: true
    filename?: true
    originalSize?: true
    fileHash?: true
    mimeType?: true
    extractedText?: true
    wordCount?: true
    pageCount?: true
    aiProvider?: true
    extractionCost?: true
    summary?: true
    processedAt?: true
    processingTime?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    userId?: true
    filename?: true
    originalSize?: true
    fileHash?: true
    mimeType?: true
    extractedText?: true
    wordCount?: true
    pageCount?: true
    aiProvider?: true
    extractionCost?: true
    summary?: true
    processedAt?: true
    processingTime?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    userId?: true
    filename?: true
    originalSize?: true
    fileHash?: true
    mimeType?: true
    extractedText?: true
    wordCount?: true
    pageCount?: true
    aiProvider?: true
    extractionCost?: true
    summary?: true
    sections?: true
    processedAt?: true
    processingTime?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _avg?: DocumentAvgAggregateInputType
    _sum?: DocumentSumAggregateInputType
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    userId: string | null
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost: number
    summary: string | null
    sections: string[]
    processedAt: Date
    processingTime: number
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    filename?: boolean
    originalSize?: boolean
    fileHash?: boolean
    mimeType?: boolean
    extractedText?: boolean
    wordCount?: boolean
    pageCount?: boolean
    aiProvider?: boolean
    extractionCost?: boolean
    summary?: boolean
    sections?: boolean
    processedAt?: boolean
    processingTime?: boolean
    user?: boolean | Document$userArgs<ExtArgs>
    usageRecords?: boolean | Document$usageRecordsArgs<ExtArgs>
    llmConversations?: boolean | Document$llmConversationsArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    filename?: boolean
    originalSize?: boolean
    fileHash?: boolean
    mimeType?: boolean
    extractedText?: boolean
    wordCount?: boolean
    pageCount?: boolean
    aiProvider?: boolean
    extractionCost?: boolean
    summary?: boolean
    sections?: boolean
    processedAt?: boolean
    processingTime?: boolean
    user?: boolean | Document$userArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    filename?: boolean
    originalSize?: boolean
    fileHash?: boolean
    mimeType?: boolean
    extractedText?: boolean
    wordCount?: boolean
    pageCount?: boolean
    aiProvider?: boolean
    extractionCost?: boolean
    summary?: boolean
    sections?: boolean
    processedAt?: boolean
    processingTime?: boolean
    user?: boolean | Document$userArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    userId?: boolean
    filename?: boolean
    originalSize?: boolean
    fileHash?: boolean
    mimeType?: boolean
    extractedText?: boolean
    wordCount?: boolean
    pageCount?: boolean
    aiProvider?: boolean
    extractionCost?: boolean
    summary?: boolean
    sections?: boolean
    processedAt?: boolean
    processingTime?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "filename" | "originalSize" | "fileHash" | "mimeType" | "extractedText" | "wordCount" | "pageCount" | "aiProvider" | "extractionCost" | "summary" | "sections" | "processedAt" | "processingTime", ExtArgs["result"]["document"]>
  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Document$userArgs<ExtArgs>
    usageRecords?: boolean | Document$usageRecordsArgs<ExtArgs>
    llmConversations?: boolean | Document$llmConversationsArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Document$userArgs<ExtArgs>
  }
  export type DocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Document$userArgs<ExtArgs>
  }

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      usageRecords: Prisma.$UsageRecordPayload<ExtArgs>[]
      llmConversations: Prisma.$LLMConversationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      filename: string
      originalSize: number
      fileHash: string
      mimeType: string
      extractedText: string
      wordCount: number
      pageCount: number
      aiProvider: string
      extractionCost: number
      summary: string | null
      sections: string[]
      processedAt: Date
      processingTime: number
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Document$userArgs<ExtArgs> = {}>(args?: Subset<T, Document$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    usageRecords<T extends Document$usageRecordsArgs<ExtArgs> = {}>(args?: Subset<T, Document$usageRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    llmConversations<T extends Document$llmConversationsArgs<ExtArgs> = {}>(args?: Subset<T, Document$llmConversationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'String'>
    readonly userId: FieldRef<"Document", 'String'>
    readonly filename: FieldRef<"Document", 'String'>
    readonly originalSize: FieldRef<"Document", 'Int'>
    readonly fileHash: FieldRef<"Document", 'String'>
    readonly mimeType: FieldRef<"Document", 'String'>
    readonly extractedText: FieldRef<"Document", 'String'>
    readonly wordCount: FieldRef<"Document", 'Int'>
    readonly pageCount: FieldRef<"Document", 'Int'>
    readonly aiProvider: FieldRef<"Document", 'String'>
    readonly extractionCost: FieldRef<"Document", 'Float'>
    readonly summary: FieldRef<"Document", 'String'>
    readonly sections: FieldRef<"Document", 'String[]'>
    readonly processedAt: FieldRef<"Document", 'DateTime'>
    readonly processingTime: FieldRef<"Document", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document updateManyAndReturn
   */
  export type DocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document.user
   */
  export type Document$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Document.usageRecords
   */
  export type Document$usageRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    where?: UsageRecordWhereInput
    orderBy?: UsageRecordOrderByWithRelationInput | UsageRecordOrderByWithRelationInput[]
    cursor?: UsageRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsageRecordScalarFieldEnum | UsageRecordScalarFieldEnum[]
  }

  /**
   * Document.llmConversations
   */
  export type Document$llmConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    where?: LLMConversationWhereInput
    orderBy?: LLMConversationOrderByWithRelationInput | LLMConversationOrderByWithRelationInput[]
    cursor?: LLMConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LLMConversationScalarFieldEnum | LLMConversationScalarFieldEnum[]
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model UsageRecord
   */

  export type AggregateUsageRecord = {
    _count: UsageRecordCountAggregateOutputType | null
    _avg: UsageRecordAvgAggregateOutputType | null
    _sum: UsageRecordSumAggregateOutputType | null
    _min: UsageRecordMinAggregateOutputType | null
    _max: UsageRecordMaxAggregateOutputType | null
  }

  export type UsageRecordAvgAggregateOutputType = {
    cost: number | null
    creditsUsed: number | null
  }

  export type UsageRecordSumAggregateOutputType = {
    cost: number | null
    creditsUsed: number | null
  }

  export type UsageRecordMinAggregateOutputType = {
    id: string | null
    userId: string | null
    documentId: string | null
    action: $Enums.UsageAction | null
    cost: number | null
    creditsUsed: number | null
    createdAt: Date | null
    billingMonth: string | null
  }

  export type UsageRecordMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    documentId: string | null
    action: $Enums.UsageAction | null
    cost: number | null
    creditsUsed: number | null
    createdAt: Date | null
    billingMonth: string | null
  }

  export type UsageRecordCountAggregateOutputType = {
    id: number
    userId: number
    documentId: number
    action: number
    cost: number
    creditsUsed: number
    createdAt: number
    billingMonth: number
    _all: number
  }


  export type UsageRecordAvgAggregateInputType = {
    cost?: true
    creditsUsed?: true
  }

  export type UsageRecordSumAggregateInputType = {
    cost?: true
    creditsUsed?: true
  }

  export type UsageRecordMinAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
    action?: true
    cost?: true
    creditsUsed?: true
    createdAt?: true
    billingMonth?: true
  }

  export type UsageRecordMaxAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
    action?: true
    cost?: true
    creditsUsed?: true
    createdAt?: true
    billingMonth?: true
  }

  export type UsageRecordCountAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
    action?: true
    cost?: true
    creditsUsed?: true
    createdAt?: true
    billingMonth?: true
    _all?: true
  }

  export type UsageRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageRecord to aggregate.
     */
    where?: UsageRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageRecords to fetch.
     */
    orderBy?: UsageRecordOrderByWithRelationInput | UsageRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsageRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsageRecords
    **/
    _count?: true | UsageRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsageRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsageRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsageRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsageRecordMaxAggregateInputType
  }

  export type GetUsageRecordAggregateType<T extends UsageRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateUsageRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsageRecord[P]>
      : GetScalarType<T[P], AggregateUsageRecord[P]>
  }




  export type UsageRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageRecordWhereInput
    orderBy?: UsageRecordOrderByWithAggregationInput | UsageRecordOrderByWithAggregationInput[]
    by: UsageRecordScalarFieldEnum[] | UsageRecordScalarFieldEnum
    having?: UsageRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsageRecordCountAggregateInputType | true
    _avg?: UsageRecordAvgAggregateInputType
    _sum?: UsageRecordSumAggregateInputType
    _min?: UsageRecordMinAggregateInputType
    _max?: UsageRecordMaxAggregateInputType
  }

  export type UsageRecordGroupByOutputType = {
    id: string
    userId: string
    documentId: string
    action: $Enums.UsageAction
    cost: number
    creditsUsed: number
    createdAt: Date
    billingMonth: string
    _count: UsageRecordCountAggregateOutputType | null
    _avg: UsageRecordAvgAggregateOutputType | null
    _sum: UsageRecordSumAggregateOutputType | null
    _min: UsageRecordMinAggregateOutputType | null
    _max: UsageRecordMaxAggregateOutputType | null
  }

  type GetUsageRecordGroupByPayload<T extends UsageRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsageRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsageRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsageRecordGroupByOutputType[P]>
            : GetScalarType<T[P], UsageRecordGroupByOutputType[P]>
        }
      >
    >


  export type UsageRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentId?: boolean
    action?: boolean
    cost?: boolean
    creditsUsed?: boolean
    createdAt?: boolean
    billingMonth?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageRecord"]>

  export type UsageRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentId?: boolean
    action?: boolean
    cost?: boolean
    creditsUsed?: boolean
    createdAt?: boolean
    billingMonth?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageRecord"]>

  export type UsageRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentId?: boolean
    action?: boolean
    cost?: boolean
    creditsUsed?: boolean
    createdAt?: boolean
    billingMonth?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageRecord"]>

  export type UsageRecordSelectScalar = {
    id?: boolean
    userId?: boolean
    documentId?: boolean
    action?: boolean
    cost?: boolean
    creditsUsed?: boolean
    createdAt?: boolean
    billingMonth?: boolean
  }

  export type UsageRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "documentId" | "action" | "cost" | "creditsUsed" | "createdAt" | "billingMonth", ExtArgs["result"]["usageRecord"]>
  export type UsageRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type UsageRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type UsageRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }

  export type $UsageRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UsageRecord"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      document: Prisma.$DocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      documentId: string
      action: $Enums.UsageAction
      cost: number
      creditsUsed: number
      createdAt: Date
      billingMonth: string
    }, ExtArgs["result"]["usageRecord"]>
    composites: {}
  }

  type UsageRecordGetPayload<S extends boolean | null | undefined | UsageRecordDefaultArgs> = $Result.GetResult<Prisma.$UsageRecordPayload, S>

  type UsageRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsageRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsageRecordCountAggregateInputType | true
    }

  export interface UsageRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UsageRecord'], meta: { name: 'UsageRecord' } }
    /**
     * Find zero or one UsageRecord that matches the filter.
     * @param {UsageRecordFindUniqueArgs} args - Arguments to find a UsageRecord
     * @example
     * // Get one UsageRecord
     * const usageRecord = await prisma.usageRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsageRecordFindUniqueArgs>(args: SelectSubset<T, UsageRecordFindUniqueArgs<ExtArgs>>): Prisma__UsageRecordClient<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UsageRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsageRecordFindUniqueOrThrowArgs} args - Arguments to find a UsageRecord
     * @example
     * // Get one UsageRecord
     * const usageRecord = await prisma.usageRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsageRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, UsageRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsageRecordClient<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsageRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageRecordFindFirstArgs} args - Arguments to find a UsageRecord
     * @example
     * // Get one UsageRecord
     * const usageRecord = await prisma.usageRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsageRecordFindFirstArgs>(args?: SelectSubset<T, UsageRecordFindFirstArgs<ExtArgs>>): Prisma__UsageRecordClient<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsageRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageRecordFindFirstOrThrowArgs} args - Arguments to find a UsageRecord
     * @example
     * // Get one UsageRecord
     * const usageRecord = await prisma.usageRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsageRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, UsageRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsageRecordClient<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UsageRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsageRecords
     * const usageRecords = await prisma.usageRecord.findMany()
     * 
     * // Get first 10 UsageRecords
     * const usageRecords = await prisma.usageRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usageRecordWithIdOnly = await prisma.usageRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsageRecordFindManyArgs>(args?: SelectSubset<T, UsageRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UsageRecord.
     * @param {UsageRecordCreateArgs} args - Arguments to create a UsageRecord.
     * @example
     * // Create one UsageRecord
     * const UsageRecord = await prisma.usageRecord.create({
     *   data: {
     *     // ... data to create a UsageRecord
     *   }
     * })
     * 
     */
    create<T extends UsageRecordCreateArgs>(args: SelectSubset<T, UsageRecordCreateArgs<ExtArgs>>): Prisma__UsageRecordClient<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UsageRecords.
     * @param {UsageRecordCreateManyArgs} args - Arguments to create many UsageRecords.
     * @example
     * // Create many UsageRecords
     * const usageRecord = await prisma.usageRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsageRecordCreateManyArgs>(args?: SelectSubset<T, UsageRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UsageRecords and returns the data saved in the database.
     * @param {UsageRecordCreateManyAndReturnArgs} args - Arguments to create many UsageRecords.
     * @example
     * // Create many UsageRecords
     * const usageRecord = await prisma.usageRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UsageRecords and only return the `id`
     * const usageRecordWithIdOnly = await prisma.usageRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsageRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, UsageRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UsageRecord.
     * @param {UsageRecordDeleteArgs} args - Arguments to delete one UsageRecord.
     * @example
     * // Delete one UsageRecord
     * const UsageRecord = await prisma.usageRecord.delete({
     *   where: {
     *     // ... filter to delete one UsageRecord
     *   }
     * })
     * 
     */
    delete<T extends UsageRecordDeleteArgs>(args: SelectSubset<T, UsageRecordDeleteArgs<ExtArgs>>): Prisma__UsageRecordClient<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UsageRecord.
     * @param {UsageRecordUpdateArgs} args - Arguments to update one UsageRecord.
     * @example
     * // Update one UsageRecord
     * const usageRecord = await prisma.usageRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsageRecordUpdateArgs>(args: SelectSubset<T, UsageRecordUpdateArgs<ExtArgs>>): Prisma__UsageRecordClient<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UsageRecords.
     * @param {UsageRecordDeleteManyArgs} args - Arguments to filter UsageRecords to delete.
     * @example
     * // Delete a few UsageRecords
     * const { count } = await prisma.usageRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsageRecordDeleteManyArgs>(args?: SelectSubset<T, UsageRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsageRecords
     * const usageRecord = await prisma.usageRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsageRecordUpdateManyArgs>(args: SelectSubset<T, UsageRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageRecords and returns the data updated in the database.
     * @param {UsageRecordUpdateManyAndReturnArgs} args - Arguments to update many UsageRecords.
     * @example
     * // Update many UsageRecords
     * const usageRecord = await prisma.usageRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UsageRecords and only return the `id`
     * const usageRecordWithIdOnly = await prisma.usageRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsageRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, UsageRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UsageRecord.
     * @param {UsageRecordUpsertArgs} args - Arguments to update or create a UsageRecord.
     * @example
     * // Update or create a UsageRecord
     * const usageRecord = await prisma.usageRecord.upsert({
     *   create: {
     *     // ... data to create a UsageRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsageRecord we want to update
     *   }
     * })
     */
    upsert<T extends UsageRecordUpsertArgs>(args: SelectSubset<T, UsageRecordUpsertArgs<ExtArgs>>): Prisma__UsageRecordClient<$Result.GetResult<Prisma.$UsageRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UsageRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageRecordCountArgs} args - Arguments to filter UsageRecords to count.
     * @example
     * // Count the number of UsageRecords
     * const count = await prisma.usageRecord.count({
     *   where: {
     *     // ... the filter for the UsageRecords we want to count
     *   }
     * })
    **/
    count<T extends UsageRecordCountArgs>(
      args?: Subset<T, UsageRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsageRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsageRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsageRecordAggregateArgs>(args: Subset<T, UsageRecordAggregateArgs>): Prisma.PrismaPromise<GetUsageRecordAggregateType<T>>

    /**
     * Group by UsageRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsageRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsageRecordGroupByArgs['orderBy'] }
        : { orderBy?: UsageRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsageRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsageRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UsageRecord model
   */
  readonly fields: UsageRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UsageRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsageRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    document<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UsageRecord model
   */
  interface UsageRecordFieldRefs {
    readonly id: FieldRef<"UsageRecord", 'String'>
    readonly userId: FieldRef<"UsageRecord", 'String'>
    readonly documentId: FieldRef<"UsageRecord", 'String'>
    readonly action: FieldRef<"UsageRecord", 'UsageAction'>
    readonly cost: FieldRef<"UsageRecord", 'Float'>
    readonly creditsUsed: FieldRef<"UsageRecord", 'Int'>
    readonly createdAt: FieldRef<"UsageRecord", 'DateTime'>
    readonly billingMonth: FieldRef<"UsageRecord", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UsageRecord findUnique
   */
  export type UsageRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    /**
     * Filter, which UsageRecord to fetch.
     */
    where: UsageRecordWhereUniqueInput
  }

  /**
   * UsageRecord findUniqueOrThrow
   */
  export type UsageRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    /**
     * Filter, which UsageRecord to fetch.
     */
    where: UsageRecordWhereUniqueInput
  }

  /**
   * UsageRecord findFirst
   */
  export type UsageRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    /**
     * Filter, which UsageRecord to fetch.
     */
    where?: UsageRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageRecords to fetch.
     */
    orderBy?: UsageRecordOrderByWithRelationInput | UsageRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageRecords.
     */
    cursor?: UsageRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageRecords.
     */
    distinct?: UsageRecordScalarFieldEnum | UsageRecordScalarFieldEnum[]
  }

  /**
   * UsageRecord findFirstOrThrow
   */
  export type UsageRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    /**
     * Filter, which UsageRecord to fetch.
     */
    where?: UsageRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageRecords to fetch.
     */
    orderBy?: UsageRecordOrderByWithRelationInput | UsageRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageRecords.
     */
    cursor?: UsageRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageRecords.
     */
    distinct?: UsageRecordScalarFieldEnum | UsageRecordScalarFieldEnum[]
  }

  /**
   * UsageRecord findMany
   */
  export type UsageRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    /**
     * Filter, which UsageRecords to fetch.
     */
    where?: UsageRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageRecords to fetch.
     */
    orderBy?: UsageRecordOrderByWithRelationInput | UsageRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsageRecords.
     */
    cursor?: UsageRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageRecords.
     */
    skip?: number
    distinct?: UsageRecordScalarFieldEnum | UsageRecordScalarFieldEnum[]
  }

  /**
   * UsageRecord create
   */
  export type UsageRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a UsageRecord.
     */
    data: XOR<UsageRecordCreateInput, UsageRecordUncheckedCreateInput>
  }

  /**
   * UsageRecord createMany
   */
  export type UsageRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UsageRecords.
     */
    data: UsageRecordCreateManyInput | UsageRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsageRecord createManyAndReturn
   */
  export type UsageRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * The data used to create many UsageRecords.
     */
    data: UsageRecordCreateManyInput | UsageRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsageRecord update
   */
  export type UsageRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a UsageRecord.
     */
    data: XOR<UsageRecordUpdateInput, UsageRecordUncheckedUpdateInput>
    /**
     * Choose, which UsageRecord to update.
     */
    where: UsageRecordWhereUniqueInput
  }

  /**
   * UsageRecord updateMany
   */
  export type UsageRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UsageRecords.
     */
    data: XOR<UsageRecordUpdateManyMutationInput, UsageRecordUncheckedUpdateManyInput>
    /**
     * Filter which UsageRecords to update
     */
    where?: UsageRecordWhereInput
    /**
     * Limit how many UsageRecords to update.
     */
    limit?: number
  }

  /**
   * UsageRecord updateManyAndReturn
   */
  export type UsageRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * The data used to update UsageRecords.
     */
    data: XOR<UsageRecordUpdateManyMutationInput, UsageRecordUncheckedUpdateManyInput>
    /**
     * Filter which UsageRecords to update
     */
    where?: UsageRecordWhereInput
    /**
     * Limit how many UsageRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsageRecord upsert
   */
  export type UsageRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the UsageRecord to update in case it exists.
     */
    where: UsageRecordWhereUniqueInput
    /**
     * In case the UsageRecord found by the `where` argument doesn't exist, create a new UsageRecord with this data.
     */
    create: XOR<UsageRecordCreateInput, UsageRecordUncheckedCreateInput>
    /**
     * In case the UsageRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsageRecordUpdateInput, UsageRecordUncheckedUpdateInput>
  }

  /**
   * UsageRecord delete
   */
  export type UsageRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
    /**
     * Filter which UsageRecord to delete.
     */
    where: UsageRecordWhereUniqueInput
  }

  /**
   * UsageRecord deleteMany
   */
  export type UsageRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageRecords to delete
     */
    where?: UsageRecordWhereInput
    /**
     * Limit how many UsageRecords to delete.
     */
    limit?: number
  }

  /**
   * UsageRecord without action
   */
  export type UsageRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageRecord
     */
    select?: UsageRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageRecord
     */
    omit?: UsageRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageRecordInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    amount: number | null
    itemCount: number | null
  }

  export type InvoiceSumAggregateOutputType = {
    amount: number | null
    itemCount: number | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    amount: number | null
    currency: string | null
    status: $Enums.InvoiceStatus | null
    billingPeriodStart: Date | null
    billingPeriodEnd: Date | null
    stripeInvoiceId: string | null
    stripePaymentId: string | null
    itemCount: number | null
    generatedAt: Date | null
    paidAt: Date | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    amount: number | null
    currency: string | null
    status: $Enums.InvoiceStatus | null
    billingPeriodStart: Date | null
    billingPeriodEnd: Date | null
    stripeInvoiceId: string | null
    stripePaymentId: string | null
    itemCount: number | null
    generatedAt: Date | null
    paidAt: Date | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    userId: number
    amount: number
    currency: number
    status: number
    billingPeriodStart: number
    billingPeriodEnd: number
    stripeInvoiceId: number
    stripePaymentId: number
    itemCount: number
    generatedAt: number
    paidAt: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    amount?: true
    itemCount?: true
  }

  export type InvoiceSumAggregateInputType = {
    amount?: true
    itemCount?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    currency?: true
    status?: true
    billingPeriodStart?: true
    billingPeriodEnd?: true
    stripeInvoiceId?: true
    stripePaymentId?: true
    itemCount?: true
    generatedAt?: true
    paidAt?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    currency?: true
    status?: true
    billingPeriodStart?: true
    billingPeriodEnd?: true
    stripeInvoiceId?: true
    stripePaymentId?: true
    itemCount?: true
    generatedAt?: true
    paidAt?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    currency?: true
    status?: true
    billingPeriodStart?: true
    billingPeriodEnd?: true
    stripeInvoiceId?: true
    stripePaymentId?: true
    itemCount?: true
    generatedAt?: true
    paidAt?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    userId: string
    amount: number
    currency: string
    status: $Enums.InvoiceStatus
    billingPeriodStart: Date
    billingPeriodEnd: Date
    stripeInvoiceId: string | null
    stripePaymentId: string | null
    itemCount: number
    generatedAt: Date
    paidAt: Date | null
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    billingPeriodStart?: boolean
    billingPeriodEnd?: boolean
    stripeInvoiceId?: boolean
    stripePaymentId?: boolean
    itemCount?: boolean
    generatedAt?: boolean
    paidAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    billingPeriodStart?: boolean
    billingPeriodEnd?: boolean
    stripeInvoiceId?: boolean
    stripePaymentId?: boolean
    itemCount?: boolean
    generatedAt?: boolean
    paidAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    billingPeriodStart?: boolean
    billingPeriodEnd?: boolean
    stripeInvoiceId?: boolean
    stripePaymentId?: boolean
    itemCount?: boolean
    generatedAt?: boolean
    paidAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectScalar = {
    id?: boolean
    userId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    billingPeriodStart?: boolean
    billingPeriodEnd?: boolean
    stripeInvoiceId?: boolean
    stripePaymentId?: boolean
    itemCount?: boolean
    generatedAt?: boolean
    paidAt?: boolean
  }

  export type InvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "amount" | "currency" | "status" | "billingPeriodStart" | "billingPeriodEnd" | "stripeInvoiceId" | "stripePaymentId" | "itemCount" | "generatedAt" | "paidAt", ExtArgs["result"]["invoice"]>
  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      amount: number
      currency: string
      status: $Enums.InvoiceStatus
      billingPeriodStart: Date
      billingPeriodEnd: Date
      stripeInvoiceId: string | null
      stripePaymentId: string | null
      itemCount: number
      generatedAt: Date
      paidAt: Date | null
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invoices and returns the data saved in the database.
     * @param {InvoiceCreateManyAndReturnArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices and returns the data updated in the database.
     * @param {InvoiceUpdateManyAndReturnArgs} args - Arguments to update many Invoices.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, InvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly userId: FieldRef<"Invoice", 'String'>
    readonly amount: FieldRef<"Invoice", 'Float'>
    readonly currency: FieldRef<"Invoice", 'String'>
    readonly status: FieldRef<"Invoice", 'InvoiceStatus'>
    readonly billingPeriodStart: FieldRef<"Invoice", 'DateTime'>
    readonly billingPeriodEnd: FieldRef<"Invoice", 'DateTime'>
    readonly stripeInvoiceId: FieldRef<"Invoice", 'String'>
    readonly stripePaymentId: FieldRef<"Invoice", 'String'>
    readonly itemCount: FieldRef<"Invoice", 'Int'>
    readonly generatedAt: FieldRef<"Invoice", 'DateTime'>
    readonly paidAt: FieldRef<"Invoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invoice createManyAndReturn
   */
  export type InvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to update.
     */
    limit?: number
  }

  /**
   * Invoice updateManyAndReturn
   */
  export type InvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to delete.
     */
    limit?: number
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model LLMConversation
   */

  export type AggregateLLMConversation = {
    _count: LLMConversationCountAggregateOutputType | null
    _avg: LLMConversationAvgAggregateOutputType | null
    _sum: LLMConversationSumAggregateOutputType | null
    _min: LLMConversationMinAggregateOutputType | null
    _max: LLMConversationMaxAggregateOutputType | null
  }

  export type LLMConversationAvgAggregateOutputType = {
    totalTokensUsed: number | null
    totalCost: number | null
  }

  export type LLMConversationSumAggregateOutputType = {
    totalTokensUsed: number | null
    totalCost: number | null
  }

  export type LLMConversationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: $Enums.ConversationType | null
    title: string | null
    documentId: string | null
    provider: string | null
    model: string | null
    totalTokensUsed: number | null
    totalCost: number | null
    createdAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
    status: $Enums.ConversationStatus | null
    errorMessage: string | null
  }

  export type LLMConversationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: $Enums.ConversationType | null
    title: string | null
    documentId: string | null
    provider: string | null
    model: string | null
    totalTokensUsed: number | null
    totalCost: number | null
    createdAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
    status: $Enums.ConversationStatus | null
    errorMessage: string | null
  }

  export type LLMConversationCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    title: number
    documentId: number
    provider: number
    model: number
    totalTokensUsed: number
    totalCost: number
    createdAt: number
    updatedAt: number
    completedAt: number
    status: number
    errorMessage: number
    _all: number
  }


  export type LLMConversationAvgAggregateInputType = {
    totalTokensUsed?: true
    totalCost?: true
  }

  export type LLMConversationSumAggregateInputType = {
    totalTokensUsed?: true
    totalCost?: true
  }

  export type LLMConversationMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    documentId?: true
    provider?: true
    model?: true
    totalTokensUsed?: true
    totalCost?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
    status?: true
    errorMessage?: true
  }

  export type LLMConversationMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    documentId?: true
    provider?: true
    model?: true
    totalTokensUsed?: true
    totalCost?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
    status?: true
    errorMessage?: true
  }

  export type LLMConversationCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    documentId?: true
    provider?: true
    model?: true
    totalTokensUsed?: true
    totalCost?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
    status?: true
    errorMessage?: true
    _all?: true
  }

  export type LLMConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LLMConversation to aggregate.
     */
    where?: LLMConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LLMConversations to fetch.
     */
    orderBy?: LLMConversationOrderByWithRelationInput | LLMConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LLMConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LLMConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LLMConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LLMConversations
    **/
    _count?: true | LLMConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LLMConversationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LLMConversationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LLMConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LLMConversationMaxAggregateInputType
  }

  export type GetLLMConversationAggregateType<T extends LLMConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateLLMConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLLMConversation[P]>
      : GetScalarType<T[P], AggregateLLMConversation[P]>
  }




  export type LLMConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LLMConversationWhereInput
    orderBy?: LLMConversationOrderByWithAggregationInput | LLMConversationOrderByWithAggregationInput[]
    by: LLMConversationScalarFieldEnum[] | LLMConversationScalarFieldEnum
    having?: LLMConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LLMConversationCountAggregateInputType | true
    _avg?: LLMConversationAvgAggregateInputType
    _sum?: LLMConversationSumAggregateInputType
    _min?: LLMConversationMinAggregateInputType
    _max?: LLMConversationMaxAggregateInputType
  }

  export type LLMConversationGroupByOutputType = {
    id: string
    userId: string | null
    type: $Enums.ConversationType
    title: string | null
    documentId: string | null
    provider: string
    model: string
    totalTokensUsed: number
    totalCost: number
    createdAt: Date
    updatedAt: Date
    completedAt: Date | null
    status: $Enums.ConversationStatus
    errorMessage: string | null
    _count: LLMConversationCountAggregateOutputType | null
    _avg: LLMConversationAvgAggregateOutputType | null
    _sum: LLMConversationSumAggregateOutputType | null
    _min: LLMConversationMinAggregateOutputType | null
    _max: LLMConversationMaxAggregateOutputType | null
  }

  type GetLLMConversationGroupByPayload<T extends LLMConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LLMConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LLMConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LLMConversationGroupByOutputType[P]>
            : GetScalarType<T[P], LLMConversationGroupByOutputType[P]>
        }
      >
    >


  export type LLMConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    documentId?: boolean
    provider?: boolean
    model?: boolean
    totalTokensUsed?: boolean
    totalCost?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    status?: boolean
    errorMessage?: boolean
    user?: boolean | LLMConversation$userArgs<ExtArgs>
    document?: boolean | LLMConversation$documentArgs<ExtArgs>
    messages?: boolean | LLMConversation$messagesArgs<ExtArgs>
    _count?: boolean | LLMConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lLMConversation"]>

  export type LLMConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    documentId?: boolean
    provider?: boolean
    model?: boolean
    totalTokensUsed?: boolean
    totalCost?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    status?: boolean
    errorMessage?: boolean
    user?: boolean | LLMConversation$userArgs<ExtArgs>
    document?: boolean | LLMConversation$documentArgs<ExtArgs>
  }, ExtArgs["result"]["lLMConversation"]>

  export type LLMConversationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    documentId?: boolean
    provider?: boolean
    model?: boolean
    totalTokensUsed?: boolean
    totalCost?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    status?: boolean
    errorMessage?: boolean
    user?: boolean | LLMConversation$userArgs<ExtArgs>
    document?: boolean | LLMConversation$documentArgs<ExtArgs>
  }, ExtArgs["result"]["lLMConversation"]>

  export type LLMConversationSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    documentId?: boolean
    provider?: boolean
    model?: boolean
    totalTokensUsed?: boolean
    totalCost?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    status?: boolean
    errorMessage?: boolean
  }

  export type LLMConversationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "title" | "documentId" | "provider" | "model" | "totalTokensUsed" | "totalCost" | "createdAt" | "updatedAt" | "completedAt" | "status" | "errorMessage", ExtArgs["result"]["lLMConversation"]>
  export type LLMConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | LLMConversation$userArgs<ExtArgs>
    document?: boolean | LLMConversation$documentArgs<ExtArgs>
    messages?: boolean | LLMConversation$messagesArgs<ExtArgs>
    _count?: boolean | LLMConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LLMConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | LLMConversation$userArgs<ExtArgs>
    document?: boolean | LLMConversation$documentArgs<ExtArgs>
  }
  export type LLMConversationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | LLMConversation$userArgs<ExtArgs>
    document?: boolean | LLMConversation$documentArgs<ExtArgs>
  }

  export type $LLMConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LLMConversation"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      document: Prisma.$DocumentPayload<ExtArgs> | null
      messages: Prisma.$LLMMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      type: $Enums.ConversationType
      title: string | null
      documentId: string | null
      provider: string
      model: string
      totalTokensUsed: number
      totalCost: number
      createdAt: Date
      updatedAt: Date
      completedAt: Date | null
      status: $Enums.ConversationStatus
      errorMessage: string | null
    }, ExtArgs["result"]["lLMConversation"]>
    composites: {}
  }

  type LLMConversationGetPayload<S extends boolean | null | undefined | LLMConversationDefaultArgs> = $Result.GetResult<Prisma.$LLMConversationPayload, S>

  type LLMConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LLMConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LLMConversationCountAggregateInputType | true
    }

  export interface LLMConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LLMConversation'], meta: { name: 'LLMConversation' } }
    /**
     * Find zero or one LLMConversation that matches the filter.
     * @param {LLMConversationFindUniqueArgs} args - Arguments to find a LLMConversation
     * @example
     * // Get one LLMConversation
     * const lLMConversation = await prisma.lLMConversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LLMConversationFindUniqueArgs>(args: SelectSubset<T, LLMConversationFindUniqueArgs<ExtArgs>>): Prisma__LLMConversationClient<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LLMConversation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LLMConversationFindUniqueOrThrowArgs} args - Arguments to find a LLMConversation
     * @example
     * // Get one LLMConversation
     * const lLMConversation = await prisma.lLMConversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LLMConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, LLMConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LLMConversationClient<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LLMConversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMConversationFindFirstArgs} args - Arguments to find a LLMConversation
     * @example
     * // Get one LLMConversation
     * const lLMConversation = await prisma.lLMConversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LLMConversationFindFirstArgs>(args?: SelectSubset<T, LLMConversationFindFirstArgs<ExtArgs>>): Prisma__LLMConversationClient<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LLMConversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMConversationFindFirstOrThrowArgs} args - Arguments to find a LLMConversation
     * @example
     * // Get one LLMConversation
     * const lLMConversation = await prisma.lLMConversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LLMConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, LLMConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LLMConversationClient<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LLMConversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LLMConversations
     * const lLMConversations = await prisma.lLMConversation.findMany()
     * 
     * // Get first 10 LLMConversations
     * const lLMConversations = await prisma.lLMConversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lLMConversationWithIdOnly = await prisma.lLMConversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LLMConversationFindManyArgs>(args?: SelectSubset<T, LLMConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LLMConversation.
     * @param {LLMConversationCreateArgs} args - Arguments to create a LLMConversation.
     * @example
     * // Create one LLMConversation
     * const LLMConversation = await prisma.lLMConversation.create({
     *   data: {
     *     // ... data to create a LLMConversation
     *   }
     * })
     * 
     */
    create<T extends LLMConversationCreateArgs>(args: SelectSubset<T, LLMConversationCreateArgs<ExtArgs>>): Prisma__LLMConversationClient<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LLMConversations.
     * @param {LLMConversationCreateManyArgs} args - Arguments to create many LLMConversations.
     * @example
     * // Create many LLMConversations
     * const lLMConversation = await prisma.lLMConversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LLMConversationCreateManyArgs>(args?: SelectSubset<T, LLMConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LLMConversations and returns the data saved in the database.
     * @param {LLMConversationCreateManyAndReturnArgs} args - Arguments to create many LLMConversations.
     * @example
     * // Create many LLMConversations
     * const lLMConversation = await prisma.lLMConversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LLMConversations and only return the `id`
     * const lLMConversationWithIdOnly = await prisma.lLMConversation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LLMConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, LLMConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LLMConversation.
     * @param {LLMConversationDeleteArgs} args - Arguments to delete one LLMConversation.
     * @example
     * // Delete one LLMConversation
     * const LLMConversation = await prisma.lLMConversation.delete({
     *   where: {
     *     // ... filter to delete one LLMConversation
     *   }
     * })
     * 
     */
    delete<T extends LLMConversationDeleteArgs>(args: SelectSubset<T, LLMConversationDeleteArgs<ExtArgs>>): Prisma__LLMConversationClient<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LLMConversation.
     * @param {LLMConversationUpdateArgs} args - Arguments to update one LLMConversation.
     * @example
     * // Update one LLMConversation
     * const lLMConversation = await prisma.lLMConversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LLMConversationUpdateArgs>(args: SelectSubset<T, LLMConversationUpdateArgs<ExtArgs>>): Prisma__LLMConversationClient<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LLMConversations.
     * @param {LLMConversationDeleteManyArgs} args - Arguments to filter LLMConversations to delete.
     * @example
     * // Delete a few LLMConversations
     * const { count } = await prisma.lLMConversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LLMConversationDeleteManyArgs>(args?: SelectSubset<T, LLMConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LLMConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LLMConversations
     * const lLMConversation = await prisma.lLMConversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LLMConversationUpdateManyArgs>(args: SelectSubset<T, LLMConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LLMConversations and returns the data updated in the database.
     * @param {LLMConversationUpdateManyAndReturnArgs} args - Arguments to update many LLMConversations.
     * @example
     * // Update many LLMConversations
     * const lLMConversation = await prisma.lLMConversation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LLMConversations and only return the `id`
     * const lLMConversationWithIdOnly = await prisma.lLMConversation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LLMConversationUpdateManyAndReturnArgs>(args: SelectSubset<T, LLMConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LLMConversation.
     * @param {LLMConversationUpsertArgs} args - Arguments to update or create a LLMConversation.
     * @example
     * // Update or create a LLMConversation
     * const lLMConversation = await prisma.lLMConversation.upsert({
     *   create: {
     *     // ... data to create a LLMConversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LLMConversation we want to update
     *   }
     * })
     */
    upsert<T extends LLMConversationUpsertArgs>(args: SelectSubset<T, LLMConversationUpsertArgs<ExtArgs>>): Prisma__LLMConversationClient<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LLMConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMConversationCountArgs} args - Arguments to filter LLMConversations to count.
     * @example
     * // Count the number of LLMConversations
     * const count = await prisma.lLMConversation.count({
     *   where: {
     *     // ... the filter for the LLMConversations we want to count
     *   }
     * })
    **/
    count<T extends LLMConversationCountArgs>(
      args?: Subset<T, LLMConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LLMConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LLMConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LLMConversationAggregateArgs>(args: Subset<T, LLMConversationAggregateArgs>): Prisma.PrismaPromise<GetLLMConversationAggregateType<T>>

    /**
     * Group by LLMConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LLMConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LLMConversationGroupByArgs['orderBy'] }
        : { orderBy?: LLMConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LLMConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLLMConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LLMConversation model
   */
  readonly fields: LLMConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LLMConversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LLMConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends LLMConversation$userArgs<ExtArgs> = {}>(args?: Subset<T, LLMConversation$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    document<T extends LLMConversation$documentArgs<ExtArgs> = {}>(args?: Subset<T, LLMConversation$documentArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    messages<T extends LLMConversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, LLMConversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LLMConversation model
   */
  interface LLMConversationFieldRefs {
    readonly id: FieldRef<"LLMConversation", 'String'>
    readonly userId: FieldRef<"LLMConversation", 'String'>
    readonly type: FieldRef<"LLMConversation", 'ConversationType'>
    readonly title: FieldRef<"LLMConversation", 'String'>
    readonly documentId: FieldRef<"LLMConversation", 'String'>
    readonly provider: FieldRef<"LLMConversation", 'String'>
    readonly model: FieldRef<"LLMConversation", 'String'>
    readonly totalTokensUsed: FieldRef<"LLMConversation", 'Int'>
    readonly totalCost: FieldRef<"LLMConversation", 'Float'>
    readonly createdAt: FieldRef<"LLMConversation", 'DateTime'>
    readonly updatedAt: FieldRef<"LLMConversation", 'DateTime'>
    readonly completedAt: FieldRef<"LLMConversation", 'DateTime'>
    readonly status: FieldRef<"LLMConversation", 'ConversationStatus'>
    readonly errorMessage: FieldRef<"LLMConversation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LLMConversation findUnique
   */
  export type LLMConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    /**
     * Filter, which LLMConversation to fetch.
     */
    where: LLMConversationWhereUniqueInput
  }

  /**
   * LLMConversation findUniqueOrThrow
   */
  export type LLMConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    /**
     * Filter, which LLMConversation to fetch.
     */
    where: LLMConversationWhereUniqueInput
  }

  /**
   * LLMConversation findFirst
   */
  export type LLMConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    /**
     * Filter, which LLMConversation to fetch.
     */
    where?: LLMConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LLMConversations to fetch.
     */
    orderBy?: LLMConversationOrderByWithRelationInput | LLMConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LLMConversations.
     */
    cursor?: LLMConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LLMConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LLMConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LLMConversations.
     */
    distinct?: LLMConversationScalarFieldEnum | LLMConversationScalarFieldEnum[]
  }

  /**
   * LLMConversation findFirstOrThrow
   */
  export type LLMConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    /**
     * Filter, which LLMConversation to fetch.
     */
    where?: LLMConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LLMConversations to fetch.
     */
    orderBy?: LLMConversationOrderByWithRelationInput | LLMConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LLMConversations.
     */
    cursor?: LLMConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LLMConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LLMConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LLMConversations.
     */
    distinct?: LLMConversationScalarFieldEnum | LLMConversationScalarFieldEnum[]
  }

  /**
   * LLMConversation findMany
   */
  export type LLMConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    /**
     * Filter, which LLMConversations to fetch.
     */
    where?: LLMConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LLMConversations to fetch.
     */
    orderBy?: LLMConversationOrderByWithRelationInput | LLMConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LLMConversations.
     */
    cursor?: LLMConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LLMConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LLMConversations.
     */
    skip?: number
    distinct?: LLMConversationScalarFieldEnum | LLMConversationScalarFieldEnum[]
  }

  /**
   * LLMConversation create
   */
  export type LLMConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a LLMConversation.
     */
    data: XOR<LLMConversationCreateInput, LLMConversationUncheckedCreateInput>
  }

  /**
   * LLMConversation createMany
   */
  export type LLMConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LLMConversations.
     */
    data: LLMConversationCreateManyInput | LLMConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LLMConversation createManyAndReturn
   */
  export type LLMConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * The data used to create many LLMConversations.
     */
    data: LLMConversationCreateManyInput | LLMConversationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LLMConversation update
   */
  export type LLMConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a LLMConversation.
     */
    data: XOR<LLMConversationUpdateInput, LLMConversationUncheckedUpdateInput>
    /**
     * Choose, which LLMConversation to update.
     */
    where: LLMConversationWhereUniqueInput
  }

  /**
   * LLMConversation updateMany
   */
  export type LLMConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LLMConversations.
     */
    data: XOR<LLMConversationUpdateManyMutationInput, LLMConversationUncheckedUpdateManyInput>
    /**
     * Filter which LLMConversations to update
     */
    where?: LLMConversationWhereInput
    /**
     * Limit how many LLMConversations to update.
     */
    limit?: number
  }

  /**
   * LLMConversation updateManyAndReturn
   */
  export type LLMConversationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * The data used to update LLMConversations.
     */
    data: XOR<LLMConversationUpdateManyMutationInput, LLMConversationUncheckedUpdateManyInput>
    /**
     * Filter which LLMConversations to update
     */
    where?: LLMConversationWhereInput
    /**
     * Limit how many LLMConversations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LLMConversation upsert
   */
  export type LLMConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the LLMConversation to update in case it exists.
     */
    where: LLMConversationWhereUniqueInput
    /**
     * In case the LLMConversation found by the `where` argument doesn't exist, create a new LLMConversation with this data.
     */
    create: XOR<LLMConversationCreateInput, LLMConversationUncheckedCreateInput>
    /**
     * In case the LLMConversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LLMConversationUpdateInput, LLMConversationUncheckedUpdateInput>
  }

  /**
   * LLMConversation delete
   */
  export type LLMConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
    /**
     * Filter which LLMConversation to delete.
     */
    where: LLMConversationWhereUniqueInput
  }

  /**
   * LLMConversation deleteMany
   */
  export type LLMConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LLMConversations to delete
     */
    where?: LLMConversationWhereInput
    /**
     * Limit how many LLMConversations to delete.
     */
    limit?: number
  }

  /**
   * LLMConversation.user
   */
  export type LLMConversation$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * LLMConversation.document
   */
  export type LLMConversation$documentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
  }

  /**
   * LLMConversation.messages
   */
  export type LLMConversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
    where?: LLMMessageWhereInput
    orderBy?: LLMMessageOrderByWithRelationInput | LLMMessageOrderByWithRelationInput[]
    cursor?: LLMMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LLMMessageScalarFieldEnum | LLMMessageScalarFieldEnum[]
  }

  /**
   * LLMConversation without action
   */
  export type LLMConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMConversation
     */
    select?: LLMConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMConversation
     */
    omit?: LLMConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMConversationInclude<ExtArgs> | null
  }


  /**
   * Model LLMMessage
   */

  export type AggregateLLMMessage = {
    _count: LLMMessageCountAggregateOutputType | null
    _avg: LLMMessageAvgAggregateOutputType | null
    _sum: LLMMessageSumAggregateOutputType | null
    _min: LLMMessageMinAggregateOutputType | null
    _max: LLMMessageMaxAggregateOutputType | null
  }

  export type LLMMessageAvgAggregateOutputType = {
    inputTokens: number | null
    outputTokens: number | null
    totalTokens: number | null
    cost: number | null
    messageIndex: number | null
    processingTime: number | null
    temperature: number | null
    maxTokens: number | null
  }

  export type LLMMessageSumAggregateOutputType = {
    inputTokens: number | null
    outputTokens: number | null
    totalTokens: number | null
    cost: number | null
    messageIndex: number | null
    processingTime: number | null
    temperature: number | null
    maxTokens: number | null
  }

  export type LLMMessageMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: $Enums.MessageRole | null
    content: string | null
    inputTokens: number | null
    outputTokens: number | null
    totalTokens: number | null
    cost: number | null
    messageIndex: number | null
    processingTime: number | null
    finishReason: string | null
    temperature: number | null
    maxTokens: number | null
    createdAt: Date | null
  }

  export type LLMMessageMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    role: $Enums.MessageRole | null
    content: string | null
    inputTokens: number | null
    outputTokens: number | null
    totalTokens: number | null
    cost: number | null
    messageIndex: number | null
    processingTime: number | null
    finishReason: string | null
    temperature: number | null
    maxTokens: number | null
    createdAt: Date | null
  }

  export type LLMMessageCountAggregateOutputType = {
    id: number
    conversationId: number
    role: number
    content: number
    inputTokens: number
    outputTokens: number
    totalTokens: number
    cost: number
    messageIndex: number
    processingTime: number
    finishReason: number
    temperature: number
    maxTokens: number
    createdAt: number
    _all: number
  }


  export type LLMMessageAvgAggregateInputType = {
    inputTokens?: true
    outputTokens?: true
    totalTokens?: true
    cost?: true
    messageIndex?: true
    processingTime?: true
    temperature?: true
    maxTokens?: true
  }

  export type LLMMessageSumAggregateInputType = {
    inputTokens?: true
    outputTokens?: true
    totalTokens?: true
    cost?: true
    messageIndex?: true
    processingTime?: true
    temperature?: true
    maxTokens?: true
  }

  export type LLMMessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    inputTokens?: true
    outputTokens?: true
    totalTokens?: true
    cost?: true
    messageIndex?: true
    processingTime?: true
    finishReason?: true
    temperature?: true
    maxTokens?: true
    createdAt?: true
  }

  export type LLMMessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    inputTokens?: true
    outputTokens?: true
    totalTokens?: true
    cost?: true
    messageIndex?: true
    processingTime?: true
    finishReason?: true
    temperature?: true
    maxTokens?: true
    createdAt?: true
  }

  export type LLMMessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    role?: true
    content?: true
    inputTokens?: true
    outputTokens?: true
    totalTokens?: true
    cost?: true
    messageIndex?: true
    processingTime?: true
    finishReason?: true
    temperature?: true
    maxTokens?: true
    createdAt?: true
    _all?: true
  }

  export type LLMMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LLMMessage to aggregate.
     */
    where?: LLMMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LLMMessages to fetch.
     */
    orderBy?: LLMMessageOrderByWithRelationInput | LLMMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LLMMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LLMMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LLMMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LLMMessages
    **/
    _count?: true | LLMMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LLMMessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LLMMessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LLMMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LLMMessageMaxAggregateInputType
  }

  export type GetLLMMessageAggregateType<T extends LLMMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateLLMMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLLMMessage[P]>
      : GetScalarType<T[P], AggregateLLMMessage[P]>
  }




  export type LLMMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LLMMessageWhereInput
    orderBy?: LLMMessageOrderByWithAggregationInput | LLMMessageOrderByWithAggregationInput[]
    by: LLMMessageScalarFieldEnum[] | LLMMessageScalarFieldEnum
    having?: LLMMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LLMMessageCountAggregateInputType | true
    _avg?: LLMMessageAvgAggregateInputType
    _sum?: LLMMessageSumAggregateInputType
    _min?: LLMMessageMinAggregateInputType
    _max?: LLMMessageMaxAggregateInputType
  }

  export type LLMMessageGroupByOutputType = {
    id: string
    conversationId: string
    role: $Enums.MessageRole
    content: string
    inputTokens: number | null
    outputTokens: number | null
    totalTokens: number | null
    cost: number
    messageIndex: number
    processingTime: number | null
    finishReason: string | null
    temperature: number | null
    maxTokens: number | null
    createdAt: Date
    _count: LLMMessageCountAggregateOutputType | null
    _avg: LLMMessageAvgAggregateOutputType | null
    _sum: LLMMessageSumAggregateOutputType | null
    _min: LLMMessageMinAggregateOutputType | null
    _max: LLMMessageMaxAggregateOutputType | null
  }

  type GetLLMMessageGroupByPayload<T extends LLMMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LLMMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LLMMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LLMMessageGroupByOutputType[P]>
            : GetScalarType<T[P], LLMMessageGroupByOutputType[P]>
        }
      >
    >


  export type LLMMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    totalTokens?: boolean
    cost?: boolean
    messageIndex?: boolean
    processingTime?: boolean
    finishReason?: boolean
    temperature?: boolean
    maxTokens?: boolean
    createdAt?: boolean
    conversation?: boolean | LLMConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lLMMessage"]>

  export type LLMMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    totalTokens?: boolean
    cost?: boolean
    messageIndex?: boolean
    processingTime?: boolean
    finishReason?: boolean
    temperature?: boolean
    maxTokens?: boolean
    createdAt?: boolean
    conversation?: boolean | LLMConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lLMMessage"]>

  export type LLMMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    totalTokens?: boolean
    cost?: boolean
    messageIndex?: boolean
    processingTime?: boolean
    finishReason?: boolean
    temperature?: boolean
    maxTokens?: boolean
    createdAt?: boolean
    conversation?: boolean | LLMConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lLMMessage"]>

  export type LLMMessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    role?: boolean
    content?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    totalTokens?: boolean
    cost?: boolean
    messageIndex?: boolean
    processingTime?: boolean
    finishReason?: boolean
    temperature?: boolean
    maxTokens?: boolean
    createdAt?: boolean
  }

  export type LLMMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "conversationId" | "role" | "content" | "inputTokens" | "outputTokens" | "totalTokens" | "cost" | "messageIndex" | "processingTime" | "finishReason" | "temperature" | "maxTokens" | "createdAt", ExtArgs["result"]["lLMMessage"]>
  export type LLMMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | LLMConversationDefaultArgs<ExtArgs>
  }
  export type LLMMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | LLMConversationDefaultArgs<ExtArgs>
  }
  export type LLMMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | LLMConversationDefaultArgs<ExtArgs>
  }

  export type $LLMMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LLMMessage"
    objects: {
      conversation: Prisma.$LLMConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      role: $Enums.MessageRole
      content: string
      inputTokens: number | null
      outputTokens: number | null
      totalTokens: number | null
      cost: number
      messageIndex: number
      processingTime: number | null
      finishReason: string | null
      temperature: number | null
      maxTokens: number | null
      createdAt: Date
    }, ExtArgs["result"]["lLMMessage"]>
    composites: {}
  }

  type LLMMessageGetPayload<S extends boolean | null | undefined | LLMMessageDefaultArgs> = $Result.GetResult<Prisma.$LLMMessagePayload, S>

  type LLMMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LLMMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LLMMessageCountAggregateInputType | true
    }

  export interface LLMMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LLMMessage'], meta: { name: 'LLMMessage' } }
    /**
     * Find zero or one LLMMessage that matches the filter.
     * @param {LLMMessageFindUniqueArgs} args - Arguments to find a LLMMessage
     * @example
     * // Get one LLMMessage
     * const lLMMessage = await prisma.lLMMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LLMMessageFindUniqueArgs>(args: SelectSubset<T, LLMMessageFindUniqueArgs<ExtArgs>>): Prisma__LLMMessageClient<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LLMMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LLMMessageFindUniqueOrThrowArgs} args - Arguments to find a LLMMessage
     * @example
     * // Get one LLMMessage
     * const lLMMessage = await prisma.lLMMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LLMMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, LLMMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LLMMessageClient<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LLMMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMMessageFindFirstArgs} args - Arguments to find a LLMMessage
     * @example
     * // Get one LLMMessage
     * const lLMMessage = await prisma.lLMMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LLMMessageFindFirstArgs>(args?: SelectSubset<T, LLMMessageFindFirstArgs<ExtArgs>>): Prisma__LLMMessageClient<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LLMMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMMessageFindFirstOrThrowArgs} args - Arguments to find a LLMMessage
     * @example
     * // Get one LLMMessage
     * const lLMMessage = await prisma.lLMMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LLMMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, LLMMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__LLMMessageClient<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LLMMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LLMMessages
     * const lLMMessages = await prisma.lLMMessage.findMany()
     * 
     * // Get first 10 LLMMessages
     * const lLMMessages = await prisma.lLMMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lLMMessageWithIdOnly = await prisma.lLMMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LLMMessageFindManyArgs>(args?: SelectSubset<T, LLMMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LLMMessage.
     * @param {LLMMessageCreateArgs} args - Arguments to create a LLMMessage.
     * @example
     * // Create one LLMMessage
     * const LLMMessage = await prisma.lLMMessage.create({
     *   data: {
     *     // ... data to create a LLMMessage
     *   }
     * })
     * 
     */
    create<T extends LLMMessageCreateArgs>(args: SelectSubset<T, LLMMessageCreateArgs<ExtArgs>>): Prisma__LLMMessageClient<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LLMMessages.
     * @param {LLMMessageCreateManyArgs} args - Arguments to create many LLMMessages.
     * @example
     * // Create many LLMMessages
     * const lLMMessage = await prisma.lLMMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LLMMessageCreateManyArgs>(args?: SelectSubset<T, LLMMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LLMMessages and returns the data saved in the database.
     * @param {LLMMessageCreateManyAndReturnArgs} args - Arguments to create many LLMMessages.
     * @example
     * // Create many LLMMessages
     * const lLMMessage = await prisma.lLMMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LLMMessages and only return the `id`
     * const lLMMessageWithIdOnly = await prisma.lLMMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LLMMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, LLMMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LLMMessage.
     * @param {LLMMessageDeleteArgs} args - Arguments to delete one LLMMessage.
     * @example
     * // Delete one LLMMessage
     * const LLMMessage = await prisma.lLMMessage.delete({
     *   where: {
     *     // ... filter to delete one LLMMessage
     *   }
     * })
     * 
     */
    delete<T extends LLMMessageDeleteArgs>(args: SelectSubset<T, LLMMessageDeleteArgs<ExtArgs>>): Prisma__LLMMessageClient<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LLMMessage.
     * @param {LLMMessageUpdateArgs} args - Arguments to update one LLMMessage.
     * @example
     * // Update one LLMMessage
     * const lLMMessage = await prisma.lLMMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LLMMessageUpdateArgs>(args: SelectSubset<T, LLMMessageUpdateArgs<ExtArgs>>): Prisma__LLMMessageClient<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LLMMessages.
     * @param {LLMMessageDeleteManyArgs} args - Arguments to filter LLMMessages to delete.
     * @example
     * // Delete a few LLMMessages
     * const { count } = await prisma.lLMMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LLMMessageDeleteManyArgs>(args?: SelectSubset<T, LLMMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LLMMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LLMMessages
     * const lLMMessage = await prisma.lLMMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LLMMessageUpdateManyArgs>(args: SelectSubset<T, LLMMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LLMMessages and returns the data updated in the database.
     * @param {LLMMessageUpdateManyAndReturnArgs} args - Arguments to update many LLMMessages.
     * @example
     * // Update many LLMMessages
     * const lLMMessage = await prisma.lLMMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LLMMessages and only return the `id`
     * const lLMMessageWithIdOnly = await prisma.lLMMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LLMMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, LLMMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LLMMessage.
     * @param {LLMMessageUpsertArgs} args - Arguments to update or create a LLMMessage.
     * @example
     * // Update or create a LLMMessage
     * const lLMMessage = await prisma.lLMMessage.upsert({
     *   create: {
     *     // ... data to create a LLMMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LLMMessage we want to update
     *   }
     * })
     */
    upsert<T extends LLMMessageUpsertArgs>(args: SelectSubset<T, LLMMessageUpsertArgs<ExtArgs>>): Prisma__LLMMessageClient<$Result.GetResult<Prisma.$LLMMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LLMMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMMessageCountArgs} args - Arguments to filter LLMMessages to count.
     * @example
     * // Count the number of LLMMessages
     * const count = await prisma.lLMMessage.count({
     *   where: {
     *     // ... the filter for the LLMMessages we want to count
     *   }
     * })
    **/
    count<T extends LLMMessageCountArgs>(
      args?: Subset<T, LLMMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LLMMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LLMMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LLMMessageAggregateArgs>(args: Subset<T, LLMMessageAggregateArgs>): Prisma.PrismaPromise<GetLLMMessageAggregateType<T>>

    /**
     * Group by LLMMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LLMMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LLMMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LLMMessageGroupByArgs['orderBy'] }
        : { orderBy?: LLMMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LLMMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLLMMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LLMMessage model
   */
  readonly fields: LLMMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LLMMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LLMMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends LLMConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LLMConversationDefaultArgs<ExtArgs>>): Prisma__LLMConversationClient<$Result.GetResult<Prisma.$LLMConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LLMMessage model
   */
  interface LLMMessageFieldRefs {
    readonly id: FieldRef<"LLMMessage", 'String'>
    readonly conversationId: FieldRef<"LLMMessage", 'String'>
    readonly role: FieldRef<"LLMMessage", 'MessageRole'>
    readonly content: FieldRef<"LLMMessage", 'String'>
    readonly inputTokens: FieldRef<"LLMMessage", 'Int'>
    readonly outputTokens: FieldRef<"LLMMessage", 'Int'>
    readonly totalTokens: FieldRef<"LLMMessage", 'Int'>
    readonly cost: FieldRef<"LLMMessage", 'Float'>
    readonly messageIndex: FieldRef<"LLMMessage", 'Int'>
    readonly processingTime: FieldRef<"LLMMessage", 'Int'>
    readonly finishReason: FieldRef<"LLMMessage", 'String'>
    readonly temperature: FieldRef<"LLMMessage", 'Float'>
    readonly maxTokens: FieldRef<"LLMMessage", 'Int'>
    readonly createdAt: FieldRef<"LLMMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LLMMessage findUnique
   */
  export type LLMMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
    /**
     * Filter, which LLMMessage to fetch.
     */
    where: LLMMessageWhereUniqueInput
  }

  /**
   * LLMMessage findUniqueOrThrow
   */
  export type LLMMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
    /**
     * Filter, which LLMMessage to fetch.
     */
    where: LLMMessageWhereUniqueInput
  }

  /**
   * LLMMessage findFirst
   */
  export type LLMMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
    /**
     * Filter, which LLMMessage to fetch.
     */
    where?: LLMMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LLMMessages to fetch.
     */
    orderBy?: LLMMessageOrderByWithRelationInput | LLMMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LLMMessages.
     */
    cursor?: LLMMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LLMMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LLMMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LLMMessages.
     */
    distinct?: LLMMessageScalarFieldEnum | LLMMessageScalarFieldEnum[]
  }

  /**
   * LLMMessage findFirstOrThrow
   */
  export type LLMMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
    /**
     * Filter, which LLMMessage to fetch.
     */
    where?: LLMMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LLMMessages to fetch.
     */
    orderBy?: LLMMessageOrderByWithRelationInput | LLMMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LLMMessages.
     */
    cursor?: LLMMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LLMMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LLMMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LLMMessages.
     */
    distinct?: LLMMessageScalarFieldEnum | LLMMessageScalarFieldEnum[]
  }

  /**
   * LLMMessage findMany
   */
  export type LLMMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
    /**
     * Filter, which LLMMessages to fetch.
     */
    where?: LLMMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LLMMessages to fetch.
     */
    orderBy?: LLMMessageOrderByWithRelationInput | LLMMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LLMMessages.
     */
    cursor?: LLMMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LLMMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LLMMessages.
     */
    skip?: number
    distinct?: LLMMessageScalarFieldEnum | LLMMessageScalarFieldEnum[]
  }

  /**
   * LLMMessage create
   */
  export type LLMMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a LLMMessage.
     */
    data: XOR<LLMMessageCreateInput, LLMMessageUncheckedCreateInput>
  }

  /**
   * LLMMessage createMany
   */
  export type LLMMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LLMMessages.
     */
    data: LLMMessageCreateManyInput | LLMMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LLMMessage createManyAndReturn
   */
  export type LLMMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * The data used to create many LLMMessages.
     */
    data: LLMMessageCreateManyInput | LLMMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LLMMessage update
   */
  export type LLMMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a LLMMessage.
     */
    data: XOR<LLMMessageUpdateInput, LLMMessageUncheckedUpdateInput>
    /**
     * Choose, which LLMMessage to update.
     */
    where: LLMMessageWhereUniqueInput
  }

  /**
   * LLMMessage updateMany
   */
  export type LLMMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LLMMessages.
     */
    data: XOR<LLMMessageUpdateManyMutationInput, LLMMessageUncheckedUpdateManyInput>
    /**
     * Filter which LLMMessages to update
     */
    where?: LLMMessageWhereInput
    /**
     * Limit how many LLMMessages to update.
     */
    limit?: number
  }

  /**
   * LLMMessage updateManyAndReturn
   */
  export type LLMMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * The data used to update LLMMessages.
     */
    data: XOR<LLMMessageUpdateManyMutationInput, LLMMessageUncheckedUpdateManyInput>
    /**
     * Filter which LLMMessages to update
     */
    where?: LLMMessageWhereInput
    /**
     * Limit how many LLMMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LLMMessage upsert
   */
  export type LLMMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the LLMMessage to update in case it exists.
     */
    where: LLMMessageWhereUniqueInput
    /**
     * In case the LLMMessage found by the `where` argument doesn't exist, create a new LLMMessage with this data.
     */
    create: XOR<LLMMessageCreateInput, LLMMessageUncheckedCreateInput>
    /**
     * In case the LLMMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LLMMessageUpdateInput, LLMMessageUncheckedUpdateInput>
  }

  /**
   * LLMMessage delete
   */
  export type LLMMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
    /**
     * Filter which LLMMessage to delete.
     */
    where: LLMMessageWhereUniqueInput
  }

  /**
   * LLMMessage deleteMany
   */
  export type LLMMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LLMMessages to delete
     */
    where?: LLMMessageWhereInput
    /**
     * Limit how many LLMMessages to delete.
     */
    limit?: number
  }

  /**
   * LLMMessage without action
   */
  export type LLMMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LLMMessage
     */
    select?: LLMMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LLMMessage
     */
    omit?: LLMMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LLMMessageInclude<ExtArgs> | null
  }


  /**
   * Model SharedAnalysis
   */

  export type AggregateSharedAnalysis = {
    _count: SharedAnalysisCountAggregateOutputType | null
    _avg: SharedAnalysisAvgAggregateOutputType | null
    _sum: SharedAnalysisSumAggregateOutputType | null
    _min: SharedAnalysisMinAggregateOutputType | null
    _max: SharedAnalysisMaxAggregateOutputType | null
  }

  export type SharedAnalysisAvgAggregateOutputType = {
    viewCount: number | null
  }

  export type SharedAnalysisSumAggregateOutputType = {
    viewCount: number | null
  }

  export type SharedAnalysisMinAggregateOutputType = {
    id: string | null
    userId: string | null
    analysisData: string | null
    settings: string | null
    viewCount: number | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SharedAnalysisMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    analysisData: string | null
    settings: string | null
    viewCount: number | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SharedAnalysisCountAggregateOutputType = {
    id: number
    userId: number
    analysisData: number
    settings: number
    viewCount: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SharedAnalysisAvgAggregateInputType = {
    viewCount?: true
  }

  export type SharedAnalysisSumAggregateInputType = {
    viewCount?: true
  }

  export type SharedAnalysisMinAggregateInputType = {
    id?: true
    userId?: true
    analysisData?: true
    settings?: true
    viewCount?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SharedAnalysisMaxAggregateInputType = {
    id?: true
    userId?: true
    analysisData?: true
    settings?: true
    viewCount?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SharedAnalysisCountAggregateInputType = {
    id?: true
    userId?: true
    analysisData?: true
    settings?: true
    viewCount?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SharedAnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SharedAnalysis to aggregate.
     */
    where?: SharedAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedAnalyses to fetch.
     */
    orderBy?: SharedAnalysisOrderByWithRelationInput | SharedAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SharedAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SharedAnalyses
    **/
    _count?: true | SharedAnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SharedAnalysisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SharedAnalysisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SharedAnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SharedAnalysisMaxAggregateInputType
  }

  export type GetSharedAnalysisAggregateType<T extends SharedAnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregateSharedAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSharedAnalysis[P]>
      : GetScalarType<T[P], AggregateSharedAnalysis[P]>
  }




  export type SharedAnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SharedAnalysisWhereInput
    orderBy?: SharedAnalysisOrderByWithAggregationInput | SharedAnalysisOrderByWithAggregationInput[]
    by: SharedAnalysisScalarFieldEnum[] | SharedAnalysisScalarFieldEnum
    having?: SharedAnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SharedAnalysisCountAggregateInputType | true
    _avg?: SharedAnalysisAvgAggregateInputType
    _sum?: SharedAnalysisSumAggregateInputType
    _min?: SharedAnalysisMinAggregateInputType
    _max?: SharedAnalysisMaxAggregateInputType
  }

  export type SharedAnalysisGroupByOutputType = {
    id: string
    userId: string
    analysisData: string
    settings: string | null
    viewCount: number
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: SharedAnalysisCountAggregateOutputType | null
    _avg: SharedAnalysisAvgAggregateOutputType | null
    _sum: SharedAnalysisSumAggregateOutputType | null
    _min: SharedAnalysisMinAggregateOutputType | null
    _max: SharedAnalysisMaxAggregateOutputType | null
  }

  type GetSharedAnalysisGroupByPayload<T extends SharedAnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SharedAnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SharedAnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SharedAnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], SharedAnalysisGroupByOutputType[P]>
        }
      >
    >


  export type SharedAnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    analysisData?: boolean
    settings?: boolean
    viewCount?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sharedAnalysis"]>

  export type SharedAnalysisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    analysisData?: boolean
    settings?: boolean
    viewCount?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sharedAnalysis"]>

  export type SharedAnalysisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    analysisData?: boolean
    settings?: boolean
    viewCount?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sharedAnalysis"]>

  export type SharedAnalysisSelectScalar = {
    id?: boolean
    userId?: boolean
    analysisData?: boolean
    settings?: boolean
    viewCount?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SharedAnalysisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "analysisData" | "settings" | "viewCount" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["sharedAnalysis"]>
  export type SharedAnalysisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SharedAnalysisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SharedAnalysisIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SharedAnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SharedAnalysis"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      analysisData: string
      settings: string | null
      viewCount: number
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sharedAnalysis"]>
    composites: {}
  }

  type SharedAnalysisGetPayload<S extends boolean | null | undefined | SharedAnalysisDefaultArgs> = $Result.GetResult<Prisma.$SharedAnalysisPayload, S>

  type SharedAnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SharedAnalysisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SharedAnalysisCountAggregateInputType | true
    }

  export interface SharedAnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SharedAnalysis'], meta: { name: 'SharedAnalysis' } }
    /**
     * Find zero or one SharedAnalysis that matches the filter.
     * @param {SharedAnalysisFindUniqueArgs} args - Arguments to find a SharedAnalysis
     * @example
     * // Get one SharedAnalysis
     * const sharedAnalysis = await prisma.sharedAnalysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SharedAnalysisFindUniqueArgs>(args: SelectSubset<T, SharedAnalysisFindUniqueArgs<ExtArgs>>): Prisma__SharedAnalysisClient<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SharedAnalysis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SharedAnalysisFindUniqueOrThrowArgs} args - Arguments to find a SharedAnalysis
     * @example
     * // Get one SharedAnalysis
     * const sharedAnalysis = await prisma.sharedAnalysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SharedAnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, SharedAnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SharedAnalysisClient<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SharedAnalysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAnalysisFindFirstArgs} args - Arguments to find a SharedAnalysis
     * @example
     * // Get one SharedAnalysis
     * const sharedAnalysis = await prisma.sharedAnalysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SharedAnalysisFindFirstArgs>(args?: SelectSubset<T, SharedAnalysisFindFirstArgs<ExtArgs>>): Prisma__SharedAnalysisClient<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SharedAnalysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAnalysisFindFirstOrThrowArgs} args - Arguments to find a SharedAnalysis
     * @example
     * // Get one SharedAnalysis
     * const sharedAnalysis = await prisma.sharedAnalysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SharedAnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, SharedAnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__SharedAnalysisClient<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SharedAnalyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SharedAnalyses
     * const sharedAnalyses = await prisma.sharedAnalysis.findMany()
     * 
     * // Get first 10 SharedAnalyses
     * const sharedAnalyses = await prisma.sharedAnalysis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sharedAnalysisWithIdOnly = await prisma.sharedAnalysis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SharedAnalysisFindManyArgs>(args?: SelectSubset<T, SharedAnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SharedAnalysis.
     * @param {SharedAnalysisCreateArgs} args - Arguments to create a SharedAnalysis.
     * @example
     * // Create one SharedAnalysis
     * const SharedAnalysis = await prisma.sharedAnalysis.create({
     *   data: {
     *     // ... data to create a SharedAnalysis
     *   }
     * })
     * 
     */
    create<T extends SharedAnalysisCreateArgs>(args: SelectSubset<T, SharedAnalysisCreateArgs<ExtArgs>>): Prisma__SharedAnalysisClient<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SharedAnalyses.
     * @param {SharedAnalysisCreateManyArgs} args - Arguments to create many SharedAnalyses.
     * @example
     * // Create many SharedAnalyses
     * const sharedAnalysis = await prisma.sharedAnalysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SharedAnalysisCreateManyArgs>(args?: SelectSubset<T, SharedAnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SharedAnalyses and returns the data saved in the database.
     * @param {SharedAnalysisCreateManyAndReturnArgs} args - Arguments to create many SharedAnalyses.
     * @example
     * // Create many SharedAnalyses
     * const sharedAnalysis = await prisma.sharedAnalysis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SharedAnalyses and only return the `id`
     * const sharedAnalysisWithIdOnly = await prisma.sharedAnalysis.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SharedAnalysisCreateManyAndReturnArgs>(args?: SelectSubset<T, SharedAnalysisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SharedAnalysis.
     * @param {SharedAnalysisDeleteArgs} args - Arguments to delete one SharedAnalysis.
     * @example
     * // Delete one SharedAnalysis
     * const SharedAnalysis = await prisma.sharedAnalysis.delete({
     *   where: {
     *     // ... filter to delete one SharedAnalysis
     *   }
     * })
     * 
     */
    delete<T extends SharedAnalysisDeleteArgs>(args: SelectSubset<T, SharedAnalysisDeleteArgs<ExtArgs>>): Prisma__SharedAnalysisClient<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SharedAnalysis.
     * @param {SharedAnalysisUpdateArgs} args - Arguments to update one SharedAnalysis.
     * @example
     * // Update one SharedAnalysis
     * const sharedAnalysis = await prisma.sharedAnalysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SharedAnalysisUpdateArgs>(args: SelectSubset<T, SharedAnalysisUpdateArgs<ExtArgs>>): Prisma__SharedAnalysisClient<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SharedAnalyses.
     * @param {SharedAnalysisDeleteManyArgs} args - Arguments to filter SharedAnalyses to delete.
     * @example
     * // Delete a few SharedAnalyses
     * const { count } = await prisma.sharedAnalysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SharedAnalysisDeleteManyArgs>(args?: SelectSubset<T, SharedAnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SharedAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SharedAnalyses
     * const sharedAnalysis = await prisma.sharedAnalysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SharedAnalysisUpdateManyArgs>(args: SelectSubset<T, SharedAnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SharedAnalyses and returns the data updated in the database.
     * @param {SharedAnalysisUpdateManyAndReturnArgs} args - Arguments to update many SharedAnalyses.
     * @example
     * // Update many SharedAnalyses
     * const sharedAnalysis = await prisma.sharedAnalysis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SharedAnalyses and only return the `id`
     * const sharedAnalysisWithIdOnly = await prisma.sharedAnalysis.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SharedAnalysisUpdateManyAndReturnArgs>(args: SelectSubset<T, SharedAnalysisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SharedAnalysis.
     * @param {SharedAnalysisUpsertArgs} args - Arguments to update or create a SharedAnalysis.
     * @example
     * // Update or create a SharedAnalysis
     * const sharedAnalysis = await prisma.sharedAnalysis.upsert({
     *   create: {
     *     // ... data to create a SharedAnalysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SharedAnalysis we want to update
     *   }
     * })
     */
    upsert<T extends SharedAnalysisUpsertArgs>(args: SelectSubset<T, SharedAnalysisUpsertArgs<ExtArgs>>): Prisma__SharedAnalysisClient<$Result.GetResult<Prisma.$SharedAnalysisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SharedAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAnalysisCountArgs} args - Arguments to filter SharedAnalyses to count.
     * @example
     * // Count the number of SharedAnalyses
     * const count = await prisma.sharedAnalysis.count({
     *   where: {
     *     // ... the filter for the SharedAnalyses we want to count
     *   }
     * })
    **/
    count<T extends SharedAnalysisCountArgs>(
      args?: Subset<T, SharedAnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SharedAnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SharedAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SharedAnalysisAggregateArgs>(args: Subset<T, SharedAnalysisAggregateArgs>): Prisma.PrismaPromise<GetSharedAnalysisAggregateType<T>>

    /**
     * Group by SharedAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedAnalysisGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SharedAnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SharedAnalysisGroupByArgs['orderBy'] }
        : { orderBy?: SharedAnalysisGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SharedAnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSharedAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SharedAnalysis model
   */
  readonly fields: SharedAnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SharedAnalysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SharedAnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SharedAnalysis model
   */
  interface SharedAnalysisFieldRefs {
    readonly id: FieldRef<"SharedAnalysis", 'String'>
    readonly userId: FieldRef<"SharedAnalysis", 'String'>
    readonly analysisData: FieldRef<"SharedAnalysis", 'String'>
    readonly settings: FieldRef<"SharedAnalysis", 'String'>
    readonly viewCount: FieldRef<"SharedAnalysis", 'Int'>
    readonly expiresAt: FieldRef<"SharedAnalysis", 'DateTime'>
    readonly createdAt: FieldRef<"SharedAnalysis", 'DateTime'>
    readonly updatedAt: FieldRef<"SharedAnalysis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SharedAnalysis findUnique
   */
  export type SharedAnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which SharedAnalysis to fetch.
     */
    where: SharedAnalysisWhereUniqueInput
  }

  /**
   * SharedAnalysis findUniqueOrThrow
   */
  export type SharedAnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which SharedAnalysis to fetch.
     */
    where: SharedAnalysisWhereUniqueInput
  }

  /**
   * SharedAnalysis findFirst
   */
  export type SharedAnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which SharedAnalysis to fetch.
     */
    where?: SharedAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedAnalyses to fetch.
     */
    orderBy?: SharedAnalysisOrderByWithRelationInput | SharedAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SharedAnalyses.
     */
    cursor?: SharedAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SharedAnalyses.
     */
    distinct?: SharedAnalysisScalarFieldEnum | SharedAnalysisScalarFieldEnum[]
  }

  /**
   * SharedAnalysis findFirstOrThrow
   */
  export type SharedAnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which SharedAnalysis to fetch.
     */
    where?: SharedAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedAnalyses to fetch.
     */
    orderBy?: SharedAnalysisOrderByWithRelationInput | SharedAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SharedAnalyses.
     */
    cursor?: SharedAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SharedAnalyses.
     */
    distinct?: SharedAnalysisScalarFieldEnum | SharedAnalysisScalarFieldEnum[]
  }

  /**
   * SharedAnalysis findMany
   */
  export type SharedAnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which SharedAnalyses to fetch.
     */
    where?: SharedAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedAnalyses to fetch.
     */
    orderBy?: SharedAnalysisOrderByWithRelationInput | SharedAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SharedAnalyses.
     */
    cursor?: SharedAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedAnalyses.
     */
    skip?: number
    distinct?: SharedAnalysisScalarFieldEnum | SharedAnalysisScalarFieldEnum[]
  }

  /**
   * SharedAnalysis create
   */
  export type SharedAnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to create a SharedAnalysis.
     */
    data: XOR<SharedAnalysisCreateInput, SharedAnalysisUncheckedCreateInput>
  }

  /**
   * SharedAnalysis createMany
   */
  export type SharedAnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SharedAnalyses.
     */
    data: SharedAnalysisCreateManyInput | SharedAnalysisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SharedAnalysis createManyAndReturn
   */
  export type SharedAnalysisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * The data used to create many SharedAnalyses.
     */
    data: SharedAnalysisCreateManyInput | SharedAnalysisCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SharedAnalysis update
   */
  export type SharedAnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to update a SharedAnalysis.
     */
    data: XOR<SharedAnalysisUpdateInput, SharedAnalysisUncheckedUpdateInput>
    /**
     * Choose, which SharedAnalysis to update.
     */
    where: SharedAnalysisWhereUniqueInput
  }

  /**
   * SharedAnalysis updateMany
   */
  export type SharedAnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SharedAnalyses.
     */
    data: XOR<SharedAnalysisUpdateManyMutationInput, SharedAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which SharedAnalyses to update
     */
    where?: SharedAnalysisWhereInput
    /**
     * Limit how many SharedAnalyses to update.
     */
    limit?: number
  }

  /**
   * SharedAnalysis updateManyAndReturn
   */
  export type SharedAnalysisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * The data used to update SharedAnalyses.
     */
    data: XOR<SharedAnalysisUpdateManyMutationInput, SharedAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which SharedAnalyses to update
     */
    where?: SharedAnalysisWhereInput
    /**
     * Limit how many SharedAnalyses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SharedAnalysis upsert
   */
  export type SharedAnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
    /**
     * The filter to search for the SharedAnalysis to update in case it exists.
     */
    where: SharedAnalysisWhereUniqueInput
    /**
     * In case the SharedAnalysis found by the `where` argument doesn't exist, create a new SharedAnalysis with this data.
     */
    create: XOR<SharedAnalysisCreateInput, SharedAnalysisUncheckedCreateInput>
    /**
     * In case the SharedAnalysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SharedAnalysisUpdateInput, SharedAnalysisUncheckedUpdateInput>
  }

  /**
   * SharedAnalysis delete
   */
  export type SharedAnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
    /**
     * Filter which SharedAnalysis to delete.
     */
    where: SharedAnalysisWhereUniqueInput
  }

  /**
   * SharedAnalysis deleteMany
   */
  export type SharedAnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SharedAnalyses to delete
     */
    where?: SharedAnalysisWhereInput
    /**
     * Limit how many SharedAnalyses to delete.
     */
    limit?: number
  }

  /**
   * SharedAnalysis without action
   */
  export type SharedAnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedAnalysis
     */
    select?: SharedAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedAnalysis
     */
    omit?: SharedAnalysisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedAnalysisInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    emailVerified: 'emailVerified',
    image: 'image',
    hashedPassword: 'hashedPassword',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    subscriptionTier: 'subscriptionTier',
    subscriptionId: 'subscriptionId',
    customerId: 'customerId',
    subscriptionEndsAt: 'subscriptionEndsAt',
    monthlyRoasts: 'monthlyRoasts',
    totalRoasts: 'totalRoasts',
    lastRoastReset: 'lastRoastReset'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    filename: 'filename',
    originalSize: 'originalSize',
    fileHash: 'fileHash',
    mimeType: 'mimeType',
    extractedText: 'extractedText',
    wordCount: 'wordCount',
    pageCount: 'pageCount',
    aiProvider: 'aiProvider',
    extractionCost: 'extractionCost',
    summary: 'summary',
    sections: 'sections',
    processedAt: 'processedAt',
    processingTime: 'processingTime'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const UsageRecordScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    documentId: 'documentId',
    action: 'action',
    cost: 'cost',
    creditsUsed: 'creditsUsed',
    createdAt: 'createdAt',
    billingMonth: 'billingMonth'
  };

  export type UsageRecordScalarFieldEnum = (typeof UsageRecordScalarFieldEnum)[keyof typeof UsageRecordScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    billingPeriodStart: 'billingPeriodStart',
    billingPeriodEnd: 'billingPeriodEnd',
    stripeInvoiceId: 'stripeInvoiceId',
    stripePaymentId: 'stripePaymentId',
    itemCount: 'itemCount',
    generatedAt: 'generatedAt',
    paidAt: 'paidAt'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const LLMConversationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    title: 'title',
    documentId: 'documentId',
    provider: 'provider',
    model: 'model',
    totalTokensUsed: 'totalTokensUsed',
    totalCost: 'totalCost',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    completedAt: 'completedAt',
    status: 'status',
    errorMessage: 'errorMessage'
  };

  export type LLMConversationScalarFieldEnum = (typeof LLMConversationScalarFieldEnum)[keyof typeof LLMConversationScalarFieldEnum]


  export const LLMMessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    role: 'role',
    content: 'content',
    inputTokens: 'inputTokens',
    outputTokens: 'outputTokens',
    totalTokens: 'totalTokens',
    cost: 'cost',
    messageIndex: 'messageIndex',
    processingTime: 'processingTime',
    finishReason: 'finishReason',
    temperature: 'temperature',
    maxTokens: 'maxTokens',
    createdAt: 'createdAt'
  };

  export type LLMMessageScalarFieldEnum = (typeof LLMMessageScalarFieldEnum)[keyof typeof LLMMessageScalarFieldEnum]


  export const SharedAnalysisScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    analysisData: 'analysisData',
    settings: 'settings',
    viewCount: 'viewCount',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SharedAnalysisScalarFieldEnum = (typeof SharedAnalysisScalarFieldEnum)[keyof typeof SharedAnalysisScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'SubscriptionTier'
   */
  export type EnumSubscriptionTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionTier'>
    


  /**
   * Reference to a field of type 'SubscriptionTier[]'
   */
  export type ListEnumSubscriptionTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionTier[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'UsageAction'
   */
  export type EnumUsageActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UsageAction'>
    


  /**
   * Reference to a field of type 'UsageAction[]'
   */
  export type ListEnumUsageActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UsageAction[]'>
    


  /**
   * Reference to a field of type 'InvoiceStatus'
   */
  export type EnumInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvoiceStatus'>
    


  /**
   * Reference to a field of type 'InvoiceStatus[]'
   */
  export type ListEnumInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvoiceStatus[]'>
    


  /**
   * Reference to a field of type 'ConversationType'
   */
  export type EnumConversationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationType'>
    


  /**
   * Reference to a field of type 'ConversationType[]'
   */
  export type ListEnumConversationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationType[]'>
    


  /**
   * Reference to a field of type 'ConversationStatus'
   */
  export type EnumConversationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationStatus'>
    


  /**
   * Reference to a field of type 'ConversationStatus[]'
   */
  export type ListEnumConversationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationStatus[]'>
    


  /**
   * Reference to a field of type 'MessageRole'
   */
  export type EnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageRole'>
    


  /**
   * Reference to a field of type 'MessageRole[]'
   */
  export type ListEnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageRole[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    hashedPassword?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    subscriptionTier?: EnumSubscriptionTierFilter<"User"> | $Enums.SubscriptionTier
    subscriptionId?: StringNullableFilter<"User"> | string | null
    customerId?: StringNullableFilter<"User"> | string | null
    subscriptionEndsAt?: DateTimeNullableFilter<"User"> | Date | string | null
    monthlyRoasts?: IntFilter<"User"> | number
    totalRoasts?: IntFilter<"User"> | number
    lastRoastReset?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    documents?: DocumentListRelationFilter
    usageRecords?: UsageRecordListRelationFilter
    invoices?: InvoiceListRelationFilter
    llmConversations?: LLMConversationListRelationFilter
    sharedAnalyses?: SharedAnalysisListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    hashedPassword?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionId?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    subscriptionEndsAt?: SortOrderInput | SortOrder
    monthlyRoasts?: SortOrder
    totalRoasts?: SortOrder
    lastRoastReset?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    documents?: DocumentOrderByRelationAggregateInput
    usageRecords?: UsageRecordOrderByRelationAggregateInput
    invoices?: InvoiceOrderByRelationAggregateInput
    llmConversations?: LLMConversationOrderByRelationAggregateInput
    sharedAnalyses?: SharedAnalysisOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    hashedPassword?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    subscriptionTier?: EnumSubscriptionTierFilter<"User"> | $Enums.SubscriptionTier
    subscriptionId?: StringNullableFilter<"User"> | string | null
    customerId?: StringNullableFilter<"User"> | string | null
    subscriptionEndsAt?: DateTimeNullableFilter<"User"> | Date | string | null
    monthlyRoasts?: IntFilter<"User"> | number
    totalRoasts?: IntFilter<"User"> | number
    lastRoastReset?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    documents?: DocumentListRelationFilter
    usageRecords?: UsageRecordListRelationFilter
    invoices?: InvoiceListRelationFilter
    llmConversations?: LLMConversationListRelationFilter
    sharedAnalyses?: SharedAnalysisListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    hashedPassword?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionId?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    subscriptionEndsAt?: SortOrderInput | SortOrder
    monthlyRoasts?: SortOrder
    totalRoasts?: SortOrder
    lastRoastReset?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    hashedPassword?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    subscriptionTier?: EnumSubscriptionTierWithAggregatesFilter<"User"> | $Enums.SubscriptionTier
    subscriptionId?: StringNullableWithAggregatesFilter<"User"> | string | null
    customerId?: StringNullableWithAggregatesFilter<"User"> | string | null
    subscriptionEndsAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    monthlyRoasts?: IntWithAggregatesFilter<"User"> | number
    totalRoasts?: IntWithAggregatesFilter<"User"> | number
    lastRoastReset?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    userId?: StringNullableFilter<"Document"> | string | null
    filename?: StringFilter<"Document"> | string
    originalSize?: IntFilter<"Document"> | number
    fileHash?: StringFilter<"Document"> | string
    mimeType?: StringFilter<"Document"> | string
    extractedText?: StringFilter<"Document"> | string
    wordCount?: IntFilter<"Document"> | number
    pageCount?: IntFilter<"Document"> | number
    aiProvider?: StringFilter<"Document"> | string
    extractionCost?: FloatFilter<"Document"> | number
    summary?: StringNullableFilter<"Document"> | string | null
    sections?: StringNullableListFilter<"Document">
    processedAt?: DateTimeFilter<"Document"> | Date | string
    processingTime?: IntFilter<"Document"> | number
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    usageRecords?: UsageRecordListRelationFilter
    llmConversations?: LLMConversationListRelationFilter
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    filename?: SortOrder
    originalSize?: SortOrder
    fileHash?: SortOrder
    mimeType?: SortOrder
    extractedText?: SortOrder
    wordCount?: SortOrder
    pageCount?: SortOrder
    aiProvider?: SortOrder
    extractionCost?: SortOrder
    summary?: SortOrderInput | SortOrder
    sections?: SortOrder
    processedAt?: SortOrder
    processingTime?: SortOrder
    user?: UserOrderByWithRelationInput
    usageRecords?: UsageRecordOrderByRelationAggregateInput
    llmConversations?: LLMConversationOrderByRelationAggregateInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    fileHash?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    userId?: StringNullableFilter<"Document"> | string | null
    filename?: StringFilter<"Document"> | string
    originalSize?: IntFilter<"Document"> | number
    mimeType?: StringFilter<"Document"> | string
    extractedText?: StringFilter<"Document"> | string
    wordCount?: IntFilter<"Document"> | number
    pageCount?: IntFilter<"Document"> | number
    aiProvider?: StringFilter<"Document"> | string
    extractionCost?: FloatFilter<"Document"> | number
    summary?: StringNullableFilter<"Document"> | string | null
    sections?: StringNullableListFilter<"Document">
    processedAt?: DateTimeFilter<"Document"> | Date | string
    processingTime?: IntFilter<"Document"> | number
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    usageRecords?: UsageRecordListRelationFilter
    llmConversations?: LLMConversationListRelationFilter
  }, "id" | "fileHash">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    filename?: SortOrder
    originalSize?: SortOrder
    fileHash?: SortOrder
    mimeType?: SortOrder
    extractedText?: SortOrder
    wordCount?: SortOrder
    pageCount?: SortOrder
    aiProvider?: SortOrder
    extractionCost?: SortOrder
    summary?: SortOrderInput | SortOrder
    sections?: SortOrder
    processedAt?: SortOrder
    processingTime?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _avg?: DocumentAvgOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
    _sum?: DocumentSumOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    userId?: StringNullableWithAggregatesFilter<"Document"> | string | null
    filename?: StringWithAggregatesFilter<"Document"> | string
    originalSize?: IntWithAggregatesFilter<"Document"> | number
    fileHash?: StringWithAggregatesFilter<"Document"> | string
    mimeType?: StringWithAggregatesFilter<"Document"> | string
    extractedText?: StringWithAggregatesFilter<"Document"> | string
    wordCount?: IntWithAggregatesFilter<"Document"> | number
    pageCount?: IntWithAggregatesFilter<"Document"> | number
    aiProvider?: StringWithAggregatesFilter<"Document"> | string
    extractionCost?: FloatWithAggregatesFilter<"Document"> | number
    summary?: StringNullableWithAggregatesFilter<"Document"> | string | null
    sections?: StringNullableListFilter<"Document">
    processedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    processingTime?: IntWithAggregatesFilter<"Document"> | number
  }

  export type UsageRecordWhereInput = {
    AND?: UsageRecordWhereInput | UsageRecordWhereInput[]
    OR?: UsageRecordWhereInput[]
    NOT?: UsageRecordWhereInput | UsageRecordWhereInput[]
    id?: StringFilter<"UsageRecord"> | string
    userId?: StringFilter<"UsageRecord"> | string
    documentId?: StringFilter<"UsageRecord"> | string
    action?: EnumUsageActionFilter<"UsageRecord"> | $Enums.UsageAction
    cost?: FloatFilter<"UsageRecord"> | number
    creditsUsed?: IntFilter<"UsageRecord"> | number
    createdAt?: DateTimeFilter<"UsageRecord"> | Date | string
    billingMonth?: StringFilter<"UsageRecord"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    document?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
  }

  export type UsageRecordOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    action?: SortOrder
    cost?: SortOrder
    creditsUsed?: SortOrder
    createdAt?: SortOrder
    billingMonth?: SortOrder
    user?: UserOrderByWithRelationInput
    document?: DocumentOrderByWithRelationInput
  }

  export type UsageRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UsageRecordWhereInput | UsageRecordWhereInput[]
    OR?: UsageRecordWhereInput[]
    NOT?: UsageRecordWhereInput | UsageRecordWhereInput[]
    userId?: StringFilter<"UsageRecord"> | string
    documentId?: StringFilter<"UsageRecord"> | string
    action?: EnumUsageActionFilter<"UsageRecord"> | $Enums.UsageAction
    cost?: FloatFilter<"UsageRecord"> | number
    creditsUsed?: IntFilter<"UsageRecord"> | number
    createdAt?: DateTimeFilter<"UsageRecord"> | Date | string
    billingMonth?: StringFilter<"UsageRecord"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    document?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
  }, "id">

  export type UsageRecordOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    action?: SortOrder
    cost?: SortOrder
    creditsUsed?: SortOrder
    createdAt?: SortOrder
    billingMonth?: SortOrder
    _count?: UsageRecordCountOrderByAggregateInput
    _avg?: UsageRecordAvgOrderByAggregateInput
    _max?: UsageRecordMaxOrderByAggregateInput
    _min?: UsageRecordMinOrderByAggregateInput
    _sum?: UsageRecordSumOrderByAggregateInput
  }

  export type UsageRecordScalarWhereWithAggregatesInput = {
    AND?: UsageRecordScalarWhereWithAggregatesInput | UsageRecordScalarWhereWithAggregatesInput[]
    OR?: UsageRecordScalarWhereWithAggregatesInput[]
    NOT?: UsageRecordScalarWhereWithAggregatesInput | UsageRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UsageRecord"> | string
    userId?: StringWithAggregatesFilter<"UsageRecord"> | string
    documentId?: StringWithAggregatesFilter<"UsageRecord"> | string
    action?: EnumUsageActionWithAggregatesFilter<"UsageRecord"> | $Enums.UsageAction
    cost?: FloatWithAggregatesFilter<"UsageRecord"> | number
    creditsUsed?: IntWithAggregatesFilter<"UsageRecord"> | number
    createdAt?: DateTimeWithAggregatesFilter<"UsageRecord"> | Date | string
    billingMonth?: StringWithAggregatesFilter<"UsageRecord"> | string
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: StringFilter<"Invoice"> | string
    userId?: StringFilter<"Invoice"> | string
    amount?: FloatFilter<"Invoice"> | number
    currency?: StringFilter<"Invoice"> | string
    status?: EnumInvoiceStatusFilter<"Invoice"> | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeFilter<"Invoice"> | Date | string
    billingPeriodEnd?: DateTimeFilter<"Invoice"> | Date | string
    stripeInvoiceId?: StringNullableFilter<"Invoice"> | string | null
    stripePaymentId?: StringNullableFilter<"Invoice"> | string | null
    itemCount?: IntFilter<"Invoice"> | number
    generatedAt?: DateTimeFilter<"Invoice"> | Date | string
    paidAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    billingPeriodStart?: SortOrder
    billingPeriodEnd?: SortOrder
    stripeInvoiceId?: SortOrderInput | SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    itemCount?: SortOrder
    generatedAt?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripeInvoiceId?: string
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    userId?: StringFilter<"Invoice"> | string
    amount?: FloatFilter<"Invoice"> | number
    currency?: StringFilter<"Invoice"> | string
    status?: EnumInvoiceStatusFilter<"Invoice"> | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeFilter<"Invoice"> | Date | string
    billingPeriodEnd?: DateTimeFilter<"Invoice"> | Date | string
    stripePaymentId?: StringNullableFilter<"Invoice"> | string | null
    itemCount?: IntFilter<"Invoice"> | number
    generatedAt?: DateTimeFilter<"Invoice"> | Date | string
    paidAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "stripeInvoiceId">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    billingPeriodStart?: SortOrder
    billingPeriodEnd?: SortOrder
    stripeInvoiceId?: SortOrderInput | SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    itemCount?: SortOrder
    generatedAt?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _avg?: InvoiceAvgOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
    _sum?: InvoiceSumOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invoice"> | string
    userId?: StringWithAggregatesFilter<"Invoice"> | string
    amount?: FloatWithAggregatesFilter<"Invoice"> | number
    currency?: StringWithAggregatesFilter<"Invoice"> | string
    status?: EnumInvoiceStatusWithAggregatesFilter<"Invoice"> | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    billingPeriodEnd?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    stripeInvoiceId?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    stripePaymentId?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    itemCount?: IntWithAggregatesFilter<"Invoice"> | number
    generatedAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    paidAt?: DateTimeNullableWithAggregatesFilter<"Invoice"> | Date | string | null
  }

  export type LLMConversationWhereInput = {
    AND?: LLMConversationWhereInput | LLMConversationWhereInput[]
    OR?: LLMConversationWhereInput[]
    NOT?: LLMConversationWhereInput | LLMConversationWhereInput[]
    id?: StringFilter<"LLMConversation"> | string
    userId?: StringNullableFilter<"LLMConversation"> | string | null
    type?: EnumConversationTypeFilter<"LLMConversation"> | $Enums.ConversationType
    title?: StringNullableFilter<"LLMConversation"> | string | null
    documentId?: StringNullableFilter<"LLMConversation"> | string | null
    provider?: StringFilter<"LLMConversation"> | string
    model?: StringFilter<"LLMConversation"> | string
    totalTokensUsed?: IntFilter<"LLMConversation"> | number
    totalCost?: FloatFilter<"LLMConversation"> | number
    createdAt?: DateTimeFilter<"LLMConversation"> | Date | string
    updatedAt?: DateTimeFilter<"LLMConversation"> | Date | string
    completedAt?: DateTimeNullableFilter<"LLMConversation"> | Date | string | null
    status?: EnumConversationStatusFilter<"LLMConversation"> | $Enums.ConversationStatus
    errorMessage?: StringNullableFilter<"LLMConversation"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    document?: XOR<DocumentNullableScalarRelationFilter, DocumentWhereInput> | null
    messages?: LLMMessageListRelationFilter
  }

  export type LLMConversationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    type?: SortOrder
    title?: SortOrderInput | SortOrder
    documentId?: SortOrderInput | SortOrder
    provider?: SortOrder
    model?: SortOrder
    totalTokensUsed?: SortOrder
    totalCost?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    document?: DocumentOrderByWithRelationInput
    messages?: LLMMessageOrderByRelationAggregateInput
  }

  export type LLMConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LLMConversationWhereInput | LLMConversationWhereInput[]
    OR?: LLMConversationWhereInput[]
    NOT?: LLMConversationWhereInput | LLMConversationWhereInput[]
    userId?: StringNullableFilter<"LLMConversation"> | string | null
    type?: EnumConversationTypeFilter<"LLMConversation"> | $Enums.ConversationType
    title?: StringNullableFilter<"LLMConversation"> | string | null
    documentId?: StringNullableFilter<"LLMConversation"> | string | null
    provider?: StringFilter<"LLMConversation"> | string
    model?: StringFilter<"LLMConversation"> | string
    totalTokensUsed?: IntFilter<"LLMConversation"> | number
    totalCost?: FloatFilter<"LLMConversation"> | number
    createdAt?: DateTimeFilter<"LLMConversation"> | Date | string
    updatedAt?: DateTimeFilter<"LLMConversation"> | Date | string
    completedAt?: DateTimeNullableFilter<"LLMConversation"> | Date | string | null
    status?: EnumConversationStatusFilter<"LLMConversation"> | $Enums.ConversationStatus
    errorMessage?: StringNullableFilter<"LLMConversation"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    document?: XOR<DocumentNullableScalarRelationFilter, DocumentWhereInput> | null
    messages?: LLMMessageListRelationFilter
  }, "id">

  export type LLMConversationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    type?: SortOrder
    title?: SortOrderInput | SortOrder
    documentId?: SortOrderInput | SortOrder
    provider?: SortOrder
    model?: SortOrder
    totalTokensUsed?: SortOrder
    totalCost?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    _count?: LLMConversationCountOrderByAggregateInput
    _avg?: LLMConversationAvgOrderByAggregateInput
    _max?: LLMConversationMaxOrderByAggregateInput
    _min?: LLMConversationMinOrderByAggregateInput
    _sum?: LLMConversationSumOrderByAggregateInput
  }

  export type LLMConversationScalarWhereWithAggregatesInput = {
    AND?: LLMConversationScalarWhereWithAggregatesInput | LLMConversationScalarWhereWithAggregatesInput[]
    OR?: LLMConversationScalarWhereWithAggregatesInput[]
    NOT?: LLMConversationScalarWhereWithAggregatesInput | LLMConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LLMConversation"> | string
    userId?: StringNullableWithAggregatesFilter<"LLMConversation"> | string | null
    type?: EnumConversationTypeWithAggregatesFilter<"LLMConversation"> | $Enums.ConversationType
    title?: StringNullableWithAggregatesFilter<"LLMConversation"> | string | null
    documentId?: StringNullableWithAggregatesFilter<"LLMConversation"> | string | null
    provider?: StringWithAggregatesFilter<"LLMConversation"> | string
    model?: StringWithAggregatesFilter<"LLMConversation"> | string
    totalTokensUsed?: IntWithAggregatesFilter<"LLMConversation"> | number
    totalCost?: FloatWithAggregatesFilter<"LLMConversation"> | number
    createdAt?: DateTimeWithAggregatesFilter<"LLMConversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LLMConversation"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"LLMConversation"> | Date | string | null
    status?: EnumConversationStatusWithAggregatesFilter<"LLMConversation"> | $Enums.ConversationStatus
    errorMessage?: StringNullableWithAggregatesFilter<"LLMConversation"> | string | null
  }

  export type LLMMessageWhereInput = {
    AND?: LLMMessageWhereInput | LLMMessageWhereInput[]
    OR?: LLMMessageWhereInput[]
    NOT?: LLMMessageWhereInput | LLMMessageWhereInput[]
    id?: StringFilter<"LLMMessage"> | string
    conversationId?: StringFilter<"LLMMessage"> | string
    role?: EnumMessageRoleFilter<"LLMMessage"> | $Enums.MessageRole
    content?: StringFilter<"LLMMessage"> | string
    inputTokens?: IntNullableFilter<"LLMMessage"> | number | null
    outputTokens?: IntNullableFilter<"LLMMessage"> | number | null
    totalTokens?: IntNullableFilter<"LLMMessage"> | number | null
    cost?: FloatFilter<"LLMMessage"> | number
    messageIndex?: IntFilter<"LLMMessage"> | number
    processingTime?: IntNullableFilter<"LLMMessage"> | number | null
    finishReason?: StringNullableFilter<"LLMMessage"> | string | null
    temperature?: FloatNullableFilter<"LLMMessage"> | number | null
    maxTokens?: IntNullableFilter<"LLMMessage"> | number | null
    createdAt?: DateTimeFilter<"LLMMessage"> | Date | string
    conversation?: XOR<LLMConversationScalarRelationFilter, LLMConversationWhereInput>
  }

  export type LLMMessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    inputTokens?: SortOrderInput | SortOrder
    outputTokens?: SortOrderInput | SortOrder
    totalTokens?: SortOrderInput | SortOrder
    cost?: SortOrder
    messageIndex?: SortOrder
    processingTime?: SortOrderInput | SortOrder
    finishReason?: SortOrderInput | SortOrder
    temperature?: SortOrderInput | SortOrder
    maxTokens?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    conversation?: LLMConversationOrderByWithRelationInput
  }

  export type LLMMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    conversationId_messageIndex?: LLMMessageConversationIdMessageIndexCompoundUniqueInput
    AND?: LLMMessageWhereInput | LLMMessageWhereInput[]
    OR?: LLMMessageWhereInput[]
    NOT?: LLMMessageWhereInput | LLMMessageWhereInput[]
    conversationId?: StringFilter<"LLMMessage"> | string
    role?: EnumMessageRoleFilter<"LLMMessage"> | $Enums.MessageRole
    content?: StringFilter<"LLMMessage"> | string
    inputTokens?: IntNullableFilter<"LLMMessage"> | number | null
    outputTokens?: IntNullableFilter<"LLMMessage"> | number | null
    totalTokens?: IntNullableFilter<"LLMMessage"> | number | null
    cost?: FloatFilter<"LLMMessage"> | number
    messageIndex?: IntFilter<"LLMMessage"> | number
    processingTime?: IntNullableFilter<"LLMMessage"> | number | null
    finishReason?: StringNullableFilter<"LLMMessage"> | string | null
    temperature?: FloatNullableFilter<"LLMMessage"> | number | null
    maxTokens?: IntNullableFilter<"LLMMessage"> | number | null
    createdAt?: DateTimeFilter<"LLMMessage"> | Date | string
    conversation?: XOR<LLMConversationScalarRelationFilter, LLMConversationWhereInput>
  }, "id" | "conversationId_messageIndex">

  export type LLMMessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    inputTokens?: SortOrderInput | SortOrder
    outputTokens?: SortOrderInput | SortOrder
    totalTokens?: SortOrderInput | SortOrder
    cost?: SortOrder
    messageIndex?: SortOrder
    processingTime?: SortOrderInput | SortOrder
    finishReason?: SortOrderInput | SortOrder
    temperature?: SortOrderInput | SortOrder
    maxTokens?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LLMMessageCountOrderByAggregateInput
    _avg?: LLMMessageAvgOrderByAggregateInput
    _max?: LLMMessageMaxOrderByAggregateInput
    _min?: LLMMessageMinOrderByAggregateInput
    _sum?: LLMMessageSumOrderByAggregateInput
  }

  export type LLMMessageScalarWhereWithAggregatesInput = {
    AND?: LLMMessageScalarWhereWithAggregatesInput | LLMMessageScalarWhereWithAggregatesInput[]
    OR?: LLMMessageScalarWhereWithAggregatesInput[]
    NOT?: LLMMessageScalarWhereWithAggregatesInput | LLMMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LLMMessage"> | string
    conversationId?: StringWithAggregatesFilter<"LLMMessage"> | string
    role?: EnumMessageRoleWithAggregatesFilter<"LLMMessage"> | $Enums.MessageRole
    content?: StringWithAggregatesFilter<"LLMMessage"> | string
    inputTokens?: IntNullableWithAggregatesFilter<"LLMMessage"> | number | null
    outputTokens?: IntNullableWithAggregatesFilter<"LLMMessage"> | number | null
    totalTokens?: IntNullableWithAggregatesFilter<"LLMMessage"> | number | null
    cost?: FloatWithAggregatesFilter<"LLMMessage"> | number
    messageIndex?: IntWithAggregatesFilter<"LLMMessage"> | number
    processingTime?: IntNullableWithAggregatesFilter<"LLMMessage"> | number | null
    finishReason?: StringNullableWithAggregatesFilter<"LLMMessage"> | string | null
    temperature?: FloatNullableWithAggregatesFilter<"LLMMessage"> | number | null
    maxTokens?: IntNullableWithAggregatesFilter<"LLMMessage"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"LLMMessage"> | Date | string
  }

  export type SharedAnalysisWhereInput = {
    AND?: SharedAnalysisWhereInput | SharedAnalysisWhereInput[]
    OR?: SharedAnalysisWhereInput[]
    NOT?: SharedAnalysisWhereInput | SharedAnalysisWhereInput[]
    id?: StringFilter<"SharedAnalysis"> | string
    userId?: StringFilter<"SharedAnalysis"> | string
    analysisData?: StringFilter<"SharedAnalysis"> | string
    settings?: StringNullableFilter<"SharedAnalysis"> | string | null
    viewCount?: IntFilter<"SharedAnalysis"> | number
    expiresAt?: DateTimeFilter<"SharedAnalysis"> | Date | string
    createdAt?: DateTimeFilter<"SharedAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"SharedAnalysis"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SharedAnalysisOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    analysisData?: SortOrder
    settings?: SortOrderInput | SortOrder
    viewCount?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SharedAnalysisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SharedAnalysisWhereInput | SharedAnalysisWhereInput[]
    OR?: SharedAnalysisWhereInput[]
    NOT?: SharedAnalysisWhereInput | SharedAnalysisWhereInput[]
    userId?: StringFilter<"SharedAnalysis"> | string
    analysisData?: StringFilter<"SharedAnalysis"> | string
    settings?: StringNullableFilter<"SharedAnalysis"> | string | null
    viewCount?: IntFilter<"SharedAnalysis"> | number
    expiresAt?: DateTimeFilter<"SharedAnalysis"> | Date | string
    createdAt?: DateTimeFilter<"SharedAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"SharedAnalysis"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SharedAnalysisOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    analysisData?: SortOrder
    settings?: SortOrderInput | SortOrder
    viewCount?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SharedAnalysisCountOrderByAggregateInput
    _avg?: SharedAnalysisAvgOrderByAggregateInput
    _max?: SharedAnalysisMaxOrderByAggregateInput
    _min?: SharedAnalysisMinOrderByAggregateInput
    _sum?: SharedAnalysisSumOrderByAggregateInput
  }

  export type SharedAnalysisScalarWhereWithAggregatesInput = {
    AND?: SharedAnalysisScalarWhereWithAggregatesInput | SharedAnalysisScalarWhereWithAggregatesInput[]
    OR?: SharedAnalysisScalarWhereWithAggregatesInput[]
    NOT?: SharedAnalysisScalarWhereWithAggregatesInput | SharedAnalysisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SharedAnalysis"> | string
    userId?: StringWithAggregatesFilter<"SharedAnalysis"> | string
    analysisData?: StringWithAggregatesFilter<"SharedAnalysis"> | string
    settings?: StringNullableWithAggregatesFilter<"SharedAnalysis"> | string | null
    viewCount?: IntWithAggregatesFilter<"SharedAnalysis"> | number
    expiresAt?: DateTimeWithAggregatesFilter<"SharedAnalysis"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"SharedAnalysis"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SharedAnalysis"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationUncheckedCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUncheckedUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateInput = {
    id?: string
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string | null
    sections?: DocumentCreatesectionsInput | string[]
    processedAt?: Date | string
    processingTime: number
    user?: UserCreateNestedOneWithoutDocumentsInput
    usageRecords?: UsageRecordCreateNestedManyWithoutDocumentInput
    llmConversations?: LLMConversationCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    userId?: string | null
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string | null
    sections?: DocumentCreatesectionsInput | string[]
    processedAt?: Date | string
    processingTime: number
    usageRecords?: UsageRecordUncheckedCreateNestedManyWithoutDocumentInput
    llmConversations?: LLMConversationUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneWithoutDocumentsNestedInput
    usageRecords?: UsageRecordUpdateManyWithoutDocumentNestedInput
    llmConversations?: LLMConversationUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
    usageRecords?: UsageRecordUncheckedUpdateManyWithoutDocumentNestedInput
    llmConversations?: LLMConversationUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentCreateManyInput = {
    id?: string
    userId?: string | null
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string | null
    sections?: DocumentCreatesectionsInput | string[]
    processedAt?: Date | string
    processingTime: number
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
  }

  export type UsageRecordCreateInput = {
    id?: string
    action: $Enums.UsageAction
    cost?: number
    creditsUsed?: number
    createdAt?: Date | string
    billingMonth: string
    user: UserCreateNestedOneWithoutUsageRecordsInput
    document: DocumentCreateNestedOneWithoutUsageRecordsInput
  }

  export type UsageRecordUncheckedCreateInput = {
    id?: string
    userId: string
    documentId: string
    action: $Enums.UsageAction
    cost?: number
    creditsUsed?: number
    createdAt?: Date | string
    billingMonth: string
  }

  export type UsageRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumUsageActionFieldUpdateOperationsInput | $Enums.UsageAction
    cost?: FloatFieldUpdateOperationsInput | number
    creditsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingMonth?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutUsageRecordsNestedInput
    document?: DocumentUpdateOneRequiredWithoutUsageRecordsNestedInput
  }

  export type UsageRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    action?: EnumUsageActionFieldUpdateOperationsInput | $Enums.UsageAction
    cost?: FloatFieldUpdateOperationsInput | number
    creditsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingMonth?: StringFieldUpdateOperationsInput | string
  }

  export type UsageRecordCreateManyInput = {
    id?: string
    userId: string
    documentId: string
    action: $Enums.UsageAction
    cost?: number
    creditsUsed?: number
    createdAt?: Date | string
    billingMonth: string
  }

  export type UsageRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumUsageActionFieldUpdateOperationsInput | $Enums.UsageAction
    cost?: FloatFieldUpdateOperationsInput | number
    creditsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingMonth?: StringFieldUpdateOperationsInput | string
  }

  export type UsageRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    action?: EnumUsageActionFieldUpdateOperationsInput | $Enums.UsageAction
    cost?: FloatFieldUpdateOperationsInput | number
    creditsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingMonth?: StringFieldUpdateOperationsInput | string
  }

  export type InvoiceCreateInput = {
    id?: string
    amount: number
    currency?: string
    status?: $Enums.InvoiceStatus
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    stripeInvoiceId?: string | null
    stripePaymentId?: string | null
    itemCount: number
    generatedAt?: Date | string
    paidAt?: Date | string | null
    user: UserCreateNestedOneWithoutInvoicesInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    userId: string
    amount: number
    currency?: string
    status?: $Enums.InvoiceStatus
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    stripeInvoiceId?: string | null
    stripePaymentId?: string | null
    itemCount: number
    generatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    itemCount?: IntFieldUpdateOperationsInput | number
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutInvoicesNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    itemCount?: IntFieldUpdateOperationsInput | number
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceCreateManyInput = {
    id?: string
    userId: string
    amount: number
    currency?: string
    status?: $Enums.InvoiceStatus
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    stripeInvoiceId?: string | null
    stripePaymentId?: string | null
    itemCount: number
    generatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    itemCount?: IntFieldUpdateOperationsInput | number
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    itemCount?: IntFieldUpdateOperationsInput | number
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LLMConversationCreateInput = {
    id?: string
    type: $Enums.ConversationType
    title?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
    user?: UserCreateNestedOneWithoutLlmConversationsInput
    document?: DocumentCreateNestedOneWithoutLlmConversationsInput
    messages?: LLMMessageCreateNestedManyWithoutConversationInput
  }

  export type LLMConversationUncheckedCreateInput = {
    id?: string
    userId?: string | null
    type: $Enums.ConversationType
    title?: string | null
    documentId?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
    messages?: LLMMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type LLMConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutLlmConversationsNestedInput
    document?: DocumentUpdateOneWithoutLlmConversationsNestedInput
    messages?: LLMMessageUpdateManyWithoutConversationNestedInput
  }

  export type LLMConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: LLMMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type LLMConversationCreateManyInput = {
    id?: string
    userId?: string | null
    type: $Enums.ConversationType
    title?: string | null
    documentId?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
  }

  export type LLMConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LLMConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LLMMessageCreateInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    inputTokens?: number | null
    outputTokens?: number | null
    totalTokens?: number | null
    cost?: number
    messageIndex: number
    processingTime?: number | null
    finishReason?: string | null
    temperature?: number | null
    maxTokens?: number | null
    createdAt?: Date | string
    conversation: LLMConversationCreateNestedOneWithoutMessagesInput
  }

  export type LLMMessageUncheckedCreateInput = {
    id?: string
    conversationId: string
    role: $Enums.MessageRole
    content: string
    inputTokens?: number | null
    outputTokens?: number | null
    totalTokens?: number | null
    cost?: number
    messageIndex: number
    processingTime?: number | null
    finishReason?: string | null
    temperature?: number | null
    maxTokens?: number | null
    createdAt?: Date | string
  }

  export type LLMMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: FloatFieldUpdateOperationsInput | number
    messageIndex?: IntFieldUpdateOperationsInput | number
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    finishReason?: NullableStringFieldUpdateOperationsInput | string | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    maxTokens?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: LLMConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type LLMMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: FloatFieldUpdateOperationsInput | number
    messageIndex?: IntFieldUpdateOperationsInput | number
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    finishReason?: NullableStringFieldUpdateOperationsInput | string | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    maxTokens?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LLMMessageCreateManyInput = {
    id?: string
    conversationId: string
    role: $Enums.MessageRole
    content: string
    inputTokens?: number | null
    outputTokens?: number | null
    totalTokens?: number | null
    cost?: number
    messageIndex: number
    processingTime?: number | null
    finishReason?: string | null
    temperature?: number | null
    maxTokens?: number | null
    createdAt?: Date | string
  }

  export type LLMMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: FloatFieldUpdateOperationsInput | number
    messageIndex?: IntFieldUpdateOperationsInput | number
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    finishReason?: NullableStringFieldUpdateOperationsInput | string | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    maxTokens?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LLMMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: FloatFieldUpdateOperationsInput | number
    messageIndex?: IntFieldUpdateOperationsInput | number
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    finishReason?: NullableStringFieldUpdateOperationsInput | string | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    maxTokens?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedAnalysisCreateInput = {
    id: string
    analysisData: string
    settings?: string | null
    viewCount?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSharedAnalysesInput
  }

  export type SharedAnalysisUncheckedCreateInput = {
    id: string
    userId: string
    analysisData: string
    settings?: string | null
    viewCount?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SharedAnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    analysisData?: StringFieldUpdateOperationsInput | string
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    viewCount?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSharedAnalysesNestedInput
  }

  export type SharedAnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    analysisData?: StringFieldUpdateOperationsInput | string
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    viewCount?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedAnalysisCreateManyInput = {
    id: string
    userId: string
    analysisData: string
    settings?: string | null
    viewCount?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SharedAnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    analysisData?: StringFieldUpdateOperationsInput | string
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    viewCount?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedAnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    analysisData?: StringFieldUpdateOperationsInput | string
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    viewCount?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumSubscriptionTierFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierFilter<$PrismaModel> | $Enums.SubscriptionTier
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type DocumentListRelationFilter = {
    every?: DocumentWhereInput
    some?: DocumentWhereInput
    none?: DocumentWhereInput
  }

  export type UsageRecordListRelationFilter = {
    every?: UsageRecordWhereInput
    some?: UsageRecordWhereInput
    none?: UsageRecordWhereInput
  }

  export type InvoiceListRelationFilter = {
    every?: InvoiceWhereInput
    some?: InvoiceWhereInput
    none?: InvoiceWhereInput
  }

  export type LLMConversationListRelationFilter = {
    every?: LLMConversationWhereInput
    some?: LLMConversationWhereInput
    none?: LLMConversationWhereInput
  }

  export type SharedAnalysisListRelationFilter = {
    every?: SharedAnalysisWhereInput
    some?: SharedAnalysisWhereInput
    none?: SharedAnalysisWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsageRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LLMConversationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SharedAnalysisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    hashedPassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionId?: SortOrder
    customerId?: SortOrder
    subscriptionEndsAt?: SortOrder
    monthlyRoasts?: SortOrder
    totalRoasts?: SortOrder
    lastRoastReset?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    monthlyRoasts?: SortOrder
    totalRoasts?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    hashedPassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionId?: SortOrder
    customerId?: SortOrder
    subscriptionEndsAt?: SortOrder
    monthlyRoasts?: SortOrder
    totalRoasts?: SortOrder
    lastRoastReset?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    hashedPassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionId?: SortOrder
    customerId?: SortOrder
    subscriptionEndsAt?: SortOrder
    monthlyRoasts?: SortOrder
    totalRoasts?: SortOrder
    lastRoastReset?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    monthlyRoasts?: SortOrder
    totalRoasts?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumSubscriptionTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionTierFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionTierFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    originalSize?: SortOrder
    fileHash?: SortOrder
    mimeType?: SortOrder
    extractedText?: SortOrder
    wordCount?: SortOrder
    pageCount?: SortOrder
    aiProvider?: SortOrder
    extractionCost?: SortOrder
    summary?: SortOrder
    sections?: SortOrder
    processedAt?: SortOrder
    processingTime?: SortOrder
  }

  export type DocumentAvgOrderByAggregateInput = {
    originalSize?: SortOrder
    wordCount?: SortOrder
    pageCount?: SortOrder
    extractionCost?: SortOrder
    processingTime?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    originalSize?: SortOrder
    fileHash?: SortOrder
    mimeType?: SortOrder
    extractedText?: SortOrder
    wordCount?: SortOrder
    pageCount?: SortOrder
    aiProvider?: SortOrder
    extractionCost?: SortOrder
    summary?: SortOrder
    processedAt?: SortOrder
    processingTime?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    originalSize?: SortOrder
    fileHash?: SortOrder
    mimeType?: SortOrder
    extractedText?: SortOrder
    wordCount?: SortOrder
    pageCount?: SortOrder
    aiProvider?: SortOrder
    extractionCost?: SortOrder
    summary?: SortOrder
    processedAt?: SortOrder
    processingTime?: SortOrder
  }

  export type DocumentSumOrderByAggregateInput = {
    originalSize?: SortOrder
    wordCount?: SortOrder
    pageCount?: SortOrder
    extractionCost?: SortOrder
    processingTime?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumUsageActionFilter<$PrismaModel = never> = {
    equals?: $Enums.UsageAction | EnumUsageActionFieldRefInput<$PrismaModel>
    in?: $Enums.UsageAction[] | ListEnumUsageActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.UsageAction[] | ListEnumUsageActionFieldRefInput<$PrismaModel>
    not?: NestedEnumUsageActionFilter<$PrismaModel> | $Enums.UsageAction
  }

  export type DocumentScalarRelationFilter = {
    is?: DocumentWhereInput
    isNot?: DocumentWhereInput
  }

  export type UsageRecordCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    action?: SortOrder
    cost?: SortOrder
    creditsUsed?: SortOrder
    createdAt?: SortOrder
    billingMonth?: SortOrder
  }

  export type UsageRecordAvgOrderByAggregateInput = {
    cost?: SortOrder
    creditsUsed?: SortOrder
  }

  export type UsageRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    action?: SortOrder
    cost?: SortOrder
    creditsUsed?: SortOrder
    createdAt?: SortOrder
    billingMonth?: SortOrder
  }

  export type UsageRecordMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    action?: SortOrder
    cost?: SortOrder
    creditsUsed?: SortOrder
    createdAt?: SortOrder
    billingMonth?: SortOrder
  }

  export type UsageRecordSumOrderByAggregateInput = {
    cost?: SortOrder
    creditsUsed?: SortOrder
  }

  export type EnumUsageActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UsageAction | EnumUsageActionFieldRefInput<$PrismaModel>
    in?: $Enums.UsageAction[] | ListEnumUsageActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.UsageAction[] | ListEnumUsageActionFieldRefInput<$PrismaModel>
    not?: NestedEnumUsageActionWithAggregatesFilter<$PrismaModel> | $Enums.UsageAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUsageActionFilter<$PrismaModel>
    _max?: NestedEnumUsageActionFilter<$PrismaModel>
  }

  export type EnumInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusFilter<$PrismaModel> | $Enums.InvoiceStatus
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    billingPeriodStart?: SortOrder
    billingPeriodEnd?: SortOrder
    stripeInvoiceId?: SortOrder
    stripePaymentId?: SortOrder
    itemCount?: SortOrder
    generatedAt?: SortOrder
    paidAt?: SortOrder
  }

  export type InvoiceAvgOrderByAggregateInput = {
    amount?: SortOrder
    itemCount?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    billingPeriodStart?: SortOrder
    billingPeriodEnd?: SortOrder
    stripeInvoiceId?: SortOrder
    stripePaymentId?: SortOrder
    itemCount?: SortOrder
    generatedAt?: SortOrder
    paidAt?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    billingPeriodStart?: SortOrder
    billingPeriodEnd?: SortOrder
    stripeInvoiceId?: SortOrder
    stripePaymentId?: SortOrder
    itemCount?: SortOrder
    generatedAt?: SortOrder
    paidAt?: SortOrder
  }

  export type InvoiceSumOrderByAggregateInput = {
    amount?: SortOrder
    itemCount?: SortOrder
  }

  export type EnumInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumInvoiceStatusFilter<$PrismaModel>
  }

  export type EnumConversationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationType | EnumConversationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationType[] | ListEnumConversationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationType[] | ListEnumConversationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationTypeFilter<$PrismaModel> | $Enums.ConversationType
  }

  export type EnumConversationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusFilter<$PrismaModel> | $Enums.ConversationStatus
  }

  export type DocumentNullableScalarRelationFilter = {
    is?: DocumentWhereInput | null
    isNot?: DocumentWhereInput | null
  }

  export type LLMMessageListRelationFilter = {
    every?: LLMMessageWhereInput
    some?: LLMMessageWhereInput
    none?: LLMMessageWhereInput
  }

  export type LLMMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LLMConversationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    documentId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    totalTokensUsed?: SortOrder
    totalCost?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
  }

  export type LLMConversationAvgOrderByAggregateInput = {
    totalTokensUsed?: SortOrder
    totalCost?: SortOrder
  }

  export type LLMConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    documentId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    totalTokensUsed?: SortOrder
    totalCost?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
  }

  export type LLMConversationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    documentId?: SortOrder
    provider?: SortOrder
    model?: SortOrder
    totalTokensUsed?: SortOrder
    totalCost?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
  }

  export type LLMConversationSumOrderByAggregateInput = {
    totalTokensUsed?: SortOrder
    totalCost?: SortOrder
  }

  export type EnumConversationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationType | EnumConversationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationType[] | ListEnumConversationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationType[] | ListEnumConversationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationTypeWithAggregatesFilter<$PrismaModel> | $Enums.ConversationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationTypeFilter<$PrismaModel>
    _max?: NestedEnumConversationTypeFilter<$PrismaModel>
  }

  export type EnumConversationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConversationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationStatusFilter<$PrismaModel>
    _max?: NestedEnumConversationStatusFilter<$PrismaModel>
  }

  export type EnumMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type LLMConversationScalarRelationFilter = {
    is?: LLMConversationWhereInput
    isNot?: LLMConversationWhereInput
  }

  export type LLMMessageConversationIdMessageIndexCompoundUniqueInput = {
    conversationId: string
    messageIndex: number
  }

  export type LLMMessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    totalTokens?: SortOrder
    cost?: SortOrder
    messageIndex?: SortOrder
    processingTime?: SortOrder
    finishReason?: SortOrder
    temperature?: SortOrder
    maxTokens?: SortOrder
    createdAt?: SortOrder
  }

  export type LLMMessageAvgOrderByAggregateInput = {
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    totalTokens?: SortOrder
    cost?: SortOrder
    messageIndex?: SortOrder
    processingTime?: SortOrder
    temperature?: SortOrder
    maxTokens?: SortOrder
  }

  export type LLMMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    totalTokens?: SortOrder
    cost?: SortOrder
    messageIndex?: SortOrder
    processingTime?: SortOrder
    finishReason?: SortOrder
    temperature?: SortOrder
    maxTokens?: SortOrder
    createdAt?: SortOrder
  }

  export type LLMMessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    totalTokens?: SortOrder
    cost?: SortOrder
    messageIndex?: SortOrder
    processingTime?: SortOrder
    finishReason?: SortOrder
    temperature?: SortOrder
    maxTokens?: SortOrder
    createdAt?: SortOrder
  }

  export type LLMMessageSumOrderByAggregateInput = {
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    totalTokens?: SortOrder
    cost?: SortOrder
    messageIndex?: SortOrder
    processingTime?: SortOrder
    temperature?: SortOrder
    maxTokens?: SortOrder
  }

  export type EnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.MessageRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageRoleFilter<$PrismaModel>
    _max?: NestedEnumMessageRoleFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type SharedAnalysisCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    analysisData?: SortOrder
    settings?: SortOrder
    viewCount?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SharedAnalysisAvgOrderByAggregateInput = {
    viewCount?: SortOrder
  }

  export type SharedAnalysisMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    analysisData?: SortOrder
    settings?: SortOrder
    viewCount?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SharedAnalysisMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    analysisData?: SortOrder
    settings?: SortOrder
    viewCount?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SharedAnalysisSumOrderByAggregateInput = {
    viewCount?: SortOrder
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type DocumentCreateNestedManyWithoutUserInput = {
    create?: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput> | DocumentCreateWithoutUserInput[] | DocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUserInput | DocumentCreateOrConnectWithoutUserInput[]
    createMany?: DocumentCreateManyUserInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type UsageRecordCreateNestedManyWithoutUserInput = {
    create?: XOR<UsageRecordCreateWithoutUserInput, UsageRecordUncheckedCreateWithoutUserInput> | UsageRecordCreateWithoutUserInput[] | UsageRecordUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UsageRecordCreateOrConnectWithoutUserInput | UsageRecordCreateOrConnectWithoutUserInput[]
    createMany?: UsageRecordCreateManyUserInputEnvelope
    connect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
  }

  export type InvoiceCreateNestedManyWithoutUserInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type LLMConversationCreateNestedManyWithoutUserInput = {
    create?: XOR<LLMConversationCreateWithoutUserInput, LLMConversationUncheckedCreateWithoutUserInput> | LLMConversationCreateWithoutUserInput[] | LLMConversationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LLMConversationCreateOrConnectWithoutUserInput | LLMConversationCreateOrConnectWithoutUserInput[]
    createMany?: LLMConversationCreateManyUserInputEnvelope
    connect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
  }

  export type SharedAnalysisCreateNestedManyWithoutUserInput = {
    create?: XOR<SharedAnalysisCreateWithoutUserInput, SharedAnalysisUncheckedCreateWithoutUserInput> | SharedAnalysisCreateWithoutUserInput[] | SharedAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SharedAnalysisCreateOrConnectWithoutUserInput | SharedAnalysisCreateOrConnectWithoutUserInput[]
    createMany?: SharedAnalysisCreateManyUserInputEnvelope
    connect?: SharedAnalysisWhereUniqueInput | SharedAnalysisWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput> | DocumentCreateWithoutUserInput[] | DocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUserInput | DocumentCreateOrConnectWithoutUserInput[]
    createMany?: DocumentCreateManyUserInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type UsageRecordUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UsageRecordCreateWithoutUserInput, UsageRecordUncheckedCreateWithoutUserInput> | UsageRecordCreateWithoutUserInput[] | UsageRecordUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UsageRecordCreateOrConnectWithoutUserInput | UsageRecordCreateOrConnectWithoutUserInput[]
    createMany?: UsageRecordCreateManyUserInputEnvelope
    connect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type LLMConversationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LLMConversationCreateWithoutUserInput, LLMConversationUncheckedCreateWithoutUserInput> | LLMConversationCreateWithoutUserInput[] | LLMConversationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LLMConversationCreateOrConnectWithoutUserInput | LLMConversationCreateOrConnectWithoutUserInput[]
    createMany?: LLMConversationCreateManyUserInputEnvelope
    connect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
  }

  export type SharedAnalysisUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SharedAnalysisCreateWithoutUserInput, SharedAnalysisUncheckedCreateWithoutUserInput> | SharedAnalysisCreateWithoutUserInput[] | SharedAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SharedAnalysisCreateOrConnectWithoutUserInput | SharedAnalysisCreateOrConnectWithoutUserInput[]
    createMany?: SharedAnalysisCreateManyUserInputEnvelope
    connect?: SharedAnalysisWhereUniqueInput | SharedAnalysisWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumSubscriptionTierFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionTier
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type DocumentUpdateManyWithoutUserNestedInput = {
    create?: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput> | DocumentCreateWithoutUserInput[] | DocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUserInput | DocumentCreateOrConnectWithoutUserInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutUserInput | DocumentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DocumentCreateManyUserInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutUserInput | DocumentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutUserInput | DocumentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type UsageRecordUpdateManyWithoutUserNestedInput = {
    create?: XOR<UsageRecordCreateWithoutUserInput, UsageRecordUncheckedCreateWithoutUserInput> | UsageRecordCreateWithoutUserInput[] | UsageRecordUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UsageRecordCreateOrConnectWithoutUserInput | UsageRecordCreateOrConnectWithoutUserInput[]
    upsert?: UsageRecordUpsertWithWhereUniqueWithoutUserInput | UsageRecordUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UsageRecordCreateManyUserInputEnvelope
    set?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    disconnect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    delete?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    connect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    update?: UsageRecordUpdateWithWhereUniqueWithoutUserInput | UsageRecordUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UsageRecordUpdateManyWithWhereWithoutUserInput | UsageRecordUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UsageRecordScalarWhereInput | UsageRecordScalarWhereInput[]
  }

  export type InvoiceUpdateManyWithoutUserNestedInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutUserInput | InvoiceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutUserInput | InvoiceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutUserInput | InvoiceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type LLMConversationUpdateManyWithoutUserNestedInput = {
    create?: XOR<LLMConversationCreateWithoutUserInput, LLMConversationUncheckedCreateWithoutUserInput> | LLMConversationCreateWithoutUserInput[] | LLMConversationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LLMConversationCreateOrConnectWithoutUserInput | LLMConversationCreateOrConnectWithoutUserInput[]
    upsert?: LLMConversationUpsertWithWhereUniqueWithoutUserInput | LLMConversationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LLMConversationCreateManyUserInputEnvelope
    set?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    disconnect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    delete?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    connect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    update?: LLMConversationUpdateWithWhereUniqueWithoutUserInput | LLMConversationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LLMConversationUpdateManyWithWhereWithoutUserInput | LLMConversationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LLMConversationScalarWhereInput | LLMConversationScalarWhereInput[]
  }

  export type SharedAnalysisUpdateManyWithoutUserNestedInput = {
    create?: XOR<SharedAnalysisCreateWithoutUserInput, SharedAnalysisUncheckedCreateWithoutUserInput> | SharedAnalysisCreateWithoutUserInput[] | SharedAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SharedAnalysisCreateOrConnectWithoutUserInput | SharedAnalysisCreateOrConnectWithoutUserInput[]
    upsert?: SharedAnalysisUpsertWithWhereUniqueWithoutUserInput | SharedAnalysisUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SharedAnalysisCreateManyUserInputEnvelope
    set?: SharedAnalysisWhereUniqueInput | SharedAnalysisWhereUniqueInput[]
    disconnect?: SharedAnalysisWhereUniqueInput | SharedAnalysisWhereUniqueInput[]
    delete?: SharedAnalysisWhereUniqueInput | SharedAnalysisWhereUniqueInput[]
    connect?: SharedAnalysisWhereUniqueInput | SharedAnalysisWhereUniqueInput[]
    update?: SharedAnalysisUpdateWithWhereUniqueWithoutUserInput | SharedAnalysisUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SharedAnalysisUpdateManyWithWhereWithoutUserInput | SharedAnalysisUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SharedAnalysisScalarWhereInput | SharedAnalysisScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput> | DocumentCreateWithoutUserInput[] | DocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUserInput | DocumentCreateOrConnectWithoutUserInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutUserInput | DocumentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DocumentCreateManyUserInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutUserInput | DocumentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutUserInput | DocumentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type UsageRecordUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UsageRecordCreateWithoutUserInput, UsageRecordUncheckedCreateWithoutUserInput> | UsageRecordCreateWithoutUserInput[] | UsageRecordUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UsageRecordCreateOrConnectWithoutUserInput | UsageRecordCreateOrConnectWithoutUserInput[]
    upsert?: UsageRecordUpsertWithWhereUniqueWithoutUserInput | UsageRecordUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UsageRecordCreateManyUserInputEnvelope
    set?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    disconnect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    delete?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    connect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    update?: UsageRecordUpdateWithWhereUniqueWithoutUserInput | UsageRecordUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UsageRecordUpdateManyWithWhereWithoutUserInput | UsageRecordUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UsageRecordScalarWhereInput | UsageRecordScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput> | InvoiceCreateWithoutUserInput[] | InvoiceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutUserInput | InvoiceCreateOrConnectWithoutUserInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutUserInput | InvoiceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InvoiceCreateManyUserInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutUserInput | InvoiceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutUserInput | InvoiceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type LLMConversationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LLMConversationCreateWithoutUserInput, LLMConversationUncheckedCreateWithoutUserInput> | LLMConversationCreateWithoutUserInput[] | LLMConversationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LLMConversationCreateOrConnectWithoutUserInput | LLMConversationCreateOrConnectWithoutUserInput[]
    upsert?: LLMConversationUpsertWithWhereUniqueWithoutUserInput | LLMConversationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LLMConversationCreateManyUserInputEnvelope
    set?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    disconnect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    delete?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    connect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    update?: LLMConversationUpdateWithWhereUniqueWithoutUserInput | LLMConversationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LLMConversationUpdateManyWithWhereWithoutUserInput | LLMConversationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LLMConversationScalarWhereInput | LLMConversationScalarWhereInput[]
  }

  export type SharedAnalysisUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SharedAnalysisCreateWithoutUserInput, SharedAnalysisUncheckedCreateWithoutUserInput> | SharedAnalysisCreateWithoutUserInput[] | SharedAnalysisUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SharedAnalysisCreateOrConnectWithoutUserInput | SharedAnalysisCreateOrConnectWithoutUserInput[]
    upsert?: SharedAnalysisUpsertWithWhereUniqueWithoutUserInput | SharedAnalysisUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SharedAnalysisCreateManyUserInputEnvelope
    set?: SharedAnalysisWhereUniqueInput | SharedAnalysisWhereUniqueInput[]
    disconnect?: SharedAnalysisWhereUniqueInput | SharedAnalysisWhereUniqueInput[]
    delete?: SharedAnalysisWhereUniqueInput | SharedAnalysisWhereUniqueInput[]
    connect?: SharedAnalysisWhereUniqueInput | SharedAnalysisWhereUniqueInput[]
    update?: SharedAnalysisUpdateWithWhereUniqueWithoutUserInput | SharedAnalysisUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SharedAnalysisUpdateManyWithWhereWithoutUserInput | SharedAnalysisUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SharedAnalysisScalarWhereInput | SharedAnalysisScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type DocumentCreatesectionsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDocumentsInput
    connect?: UserWhereUniqueInput
  }

  export type UsageRecordCreateNestedManyWithoutDocumentInput = {
    create?: XOR<UsageRecordCreateWithoutDocumentInput, UsageRecordUncheckedCreateWithoutDocumentInput> | UsageRecordCreateWithoutDocumentInput[] | UsageRecordUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: UsageRecordCreateOrConnectWithoutDocumentInput | UsageRecordCreateOrConnectWithoutDocumentInput[]
    createMany?: UsageRecordCreateManyDocumentInputEnvelope
    connect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
  }

  export type LLMConversationCreateNestedManyWithoutDocumentInput = {
    create?: XOR<LLMConversationCreateWithoutDocumentInput, LLMConversationUncheckedCreateWithoutDocumentInput> | LLMConversationCreateWithoutDocumentInput[] | LLMConversationUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: LLMConversationCreateOrConnectWithoutDocumentInput | LLMConversationCreateOrConnectWithoutDocumentInput[]
    createMany?: LLMConversationCreateManyDocumentInputEnvelope
    connect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
  }

  export type UsageRecordUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<UsageRecordCreateWithoutDocumentInput, UsageRecordUncheckedCreateWithoutDocumentInput> | UsageRecordCreateWithoutDocumentInput[] | UsageRecordUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: UsageRecordCreateOrConnectWithoutDocumentInput | UsageRecordCreateOrConnectWithoutDocumentInput[]
    createMany?: UsageRecordCreateManyDocumentInputEnvelope
    connect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
  }

  export type LLMConversationUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<LLMConversationCreateWithoutDocumentInput, LLMConversationUncheckedCreateWithoutDocumentInput> | LLMConversationCreateWithoutDocumentInput[] | LLMConversationUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: LLMConversationCreateOrConnectWithoutDocumentInput | LLMConversationCreateOrConnectWithoutDocumentInput[]
    createMany?: LLMConversationCreateManyDocumentInputEnvelope
    connect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DocumentUpdatesectionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneWithoutDocumentsNestedInput = {
    create?: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDocumentsInput
    upsert?: UserUpsertWithoutDocumentsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDocumentsInput, UserUpdateWithoutDocumentsInput>, UserUncheckedUpdateWithoutDocumentsInput>
  }

  export type UsageRecordUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<UsageRecordCreateWithoutDocumentInput, UsageRecordUncheckedCreateWithoutDocumentInput> | UsageRecordCreateWithoutDocumentInput[] | UsageRecordUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: UsageRecordCreateOrConnectWithoutDocumentInput | UsageRecordCreateOrConnectWithoutDocumentInput[]
    upsert?: UsageRecordUpsertWithWhereUniqueWithoutDocumentInput | UsageRecordUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: UsageRecordCreateManyDocumentInputEnvelope
    set?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    disconnect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    delete?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    connect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    update?: UsageRecordUpdateWithWhereUniqueWithoutDocumentInput | UsageRecordUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: UsageRecordUpdateManyWithWhereWithoutDocumentInput | UsageRecordUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: UsageRecordScalarWhereInput | UsageRecordScalarWhereInput[]
  }

  export type LLMConversationUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<LLMConversationCreateWithoutDocumentInput, LLMConversationUncheckedCreateWithoutDocumentInput> | LLMConversationCreateWithoutDocumentInput[] | LLMConversationUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: LLMConversationCreateOrConnectWithoutDocumentInput | LLMConversationCreateOrConnectWithoutDocumentInput[]
    upsert?: LLMConversationUpsertWithWhereUniqueWithoutDocumentInput | LLMConversationUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: LLMConversationCreateManyDocumentInputEnvelope
    set?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    disconnect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    delete?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    connect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    update?: LLMConversationUpdateWithWhereUniqueWithoutDocumentInput | LLMConversationUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: LLMConversationUpdateManyWithWhereWithoutDocumentInput | LLMConversationUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: LLMConversationScalarWhereInput | LLMConversationScalarWhereInput[]
  }

  export type UsageRecordUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<UsageRecordCreateWithoutDocumentInput, UsageRecordUncheckedCreateWithoutDocumentInput> | UsageRecordCreateWithoutDocumentInput[] | UsageRecordUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: UsageRecordCreateOrConnectWithoutDocumentInput | UsageRecordCreateOrConnectWithoutDocumentInput[]
    upsert?: UsageRecordUpsertWithWhereUniqueWithoutDocumentInput | UsageRecordUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: UsageRecordCreateManyDocumentInputEnvelope
    set?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    disconnect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    delete?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    connect?: UsageRecordWhereUniqueInput | UsageRecordWhereUniqueInput[]
    update?: UsageRecordUpdateWithWhereUniqueWithoutDocumentInput | UsageRecordUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: UsageRecordUpdateManyWithWhereWithoutDocumentInput | UsageRecordUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: UsageRecordScalarWhereInput | UsageRecordScalarWhereInput[]
  }

  export type LLMConversationUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<LLMConversationCreateWithoutDocumentInput, LLMConversationUncheckedCreateWithoutDocumentInput> | LLMConversationCreateWithoutDocumentInput[] | LLMConversationUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: LLMConversationCreateOrConnectWithoutDocumentInput | LLMConversationCreateOrConnectWithoutDocumentInput[]
    upsert?: LLMConversationUpsertWithWhereUniqueWithoutDocumentInput | LLMConversationUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: LLMConversationCreateManyDocumentInputEnvelope
    set?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    disconnect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    delete?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    connect?: LLMConversationWhereUniqueInput | LLMConversationWhereUniqueInput[]
    update?: LLMConversationUpdateWithWhereUniqueWithoutDocumentInput | LLMConversationUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: LLMConversationUpdateManyWithWhereWithoutDocumentInput | LLMConversationUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: LLMConversationScalarWhereInput | LLMConversationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutUsageRecordsInput = {
    create?: XOR<UserCreateWithoutUsageRecordsInput, UserUncheckedCreateWithoutUsageRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUsageRecordsInput
    connect?: UserWhereUniqueInput
  }

  export type DocumentCreateNestedOneWithoutUsageRecordsInput = {
    create?: XOR<DocumentCreateWithoutUsageRecordsInput, DocumentUncheckedCreateWithoutUsageRecordsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutUsageRecordsInput
    connect?: DocumentWhereUniqueInput
  }

  export type EnumUsageActionFieldUpdateOperationsInput = {
    set?: $Enums.UsageAction
  }

  export type UserUpdateOneRequiredWithoutUsageRecordsNestedInput = {
    create?: XOR<UserCreateWithoutUsageRecordsInput, UserUncheckedCreateWithoutUsageRecordsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUsageRecordsInput
    upsert?: UserUpsertWithoutUsageRecordsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUsageRecordsInput, UserUpdateWithoutUsageRecordsInput>, UserUncheckedUpdateWithoutUsageRecordsInput>
  }

  export type DocumentUpdateOneRequiredWithoutUsageRecordsNestedInput = {
    create?: XOR<DocumentCreateWithoutUsageRecordsInput, DocumentUncheckedCreateWithoutUsageRecordsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutUsageRecordsInput
    upsert?: DocumentUpsertWithoutUsageRecordsInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutUsageRecordsInput, DocumentUpdateWithoutUsageRecordsInput>, DocumentUncheckedUpdateWithoutUsageRecordsInput>
  }

  export type UserCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvoicesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumInvoiceStatusFieldUpdateOperationsInput = {
    set?: $Enums.InvoiceStatus
  }

  export type UserUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvoicesInput
    upsert?: UserUpsertWithoutInvoicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInvoicesInput, UserUpdateWithoutInvoicesInput>, UserUncheckedUpdateWithoutInvoicesInput>
  }

  export type UserCreateNestedOneWithoutLlmConversationsInput = {
    create?: XOR<UserCreateWithoutLlmConversationsInput, UserUncheckedCreateWithoutLlmConversationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLlmConversationsInput
    connect?: UserWhereUniqueInput
  }

  export type DocumentCreateNestedOneWithoutLlmConversationsInput = {
    create?: XOR<DocumentCreateWithoutLlmConversationsInput, DocumentUncheckedCreateWithoutLlmConversationsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutLlmConversationsInput
    connect?: DocumentWhereUniqueInput
  }

  export type LLMMessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<LLMMessageCreateWithoutConversationInput, LLMMessageUncheckedCreateWithoutConversationInput> | LLMMessageCreateWithoutConversationInput[] | LLMMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: LLMMessageCreateOrConnectWithoutConversationInput | LLMMessageCreateOrConnectWithoutConversationInput[]
    createMany?: LLMMessageCreateManyConversationInputEnvelope
    connect?: LLMMessageWhereUniqueInput | LLMMessageWhereUniqueInput[]
  }

  export type LLMMessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<LLMMessageCreateWithoutConversationInput, LLMMessageUncheckedCreateWithoutConversationInput> | LLMMessageCreateWithoutConversationInput[] | LLMMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: LLMMessageCreateOrConnectWithoutConversationInput | LLMMessageCreateOrConnectWithoutConversationInput[]
    createMany?: LLMMessageCreateManyConversationInputEnvelope
    connect?: LLMMessageWhereUniqueInput | LLMMessageWhereUniqueInput[]
  }

  export type EnumConversationTypeFieldUpdateOperationsInput = {
    set?: $Enums.ConversationType
  }

  export type EnumConversationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ConversationStatus
  }

  export type UserUpdateOneWithoutLlmConversationsNestedInput = {
    create?: XOR<UserCreateWithoutLlmConversationsInput, UserUncheckedCreateWithoutLlmConversationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLlmConversationsInput
    upsert?: UserUpsertWithoutLlmConversationsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLlmConversationsInput, UserUpdateWithoutLlmConversationsInput>, UserUncheckedUpdateWithoutLlmConversationsInput>
  }

  export type DocumentUpdateOneWithoutLlmConversationsNestedInput = {
    create?: XOR<DocumentCreateWithoutLlmConversationsInput, DocumentUncheckedCreateWithoutLlmConversationsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutLlmConversationsInput
    upsert?: DocumentUpsertWithoutLlmConversationsInput
    disconnect?: DocumentWhereInput | boolean
    delete?: DocumentWhereInput | boolean
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutLlmConversationsInput, DocumentUpdateWithoutLlmConversationsInput>, DocumentUncheckedUpdateWithoutLlmConversationsInput>
  }

  export type LLMMessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<LLMMessageCreateWithoutConversationInput, LLMMessageUncheckedCreateWithoutConversationInput> | LLMMessageCreateWithoutConversationInput[] | LLMMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: LLMMessageCreateOrConnectWithoutConversationInput | LLMMessageCreateOrConnectWithoutConversationInput[]
    upsert?: LLMMessageUpsertWithWhereUniqueWithoutConversationInput | LLMMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: LLMMessageCreateManyConversationInputEnvelope
    set?: LLMMessageWhereUniqueInput | LLMMessageWhereUniqueInput[]
    disconnect?: LLMMessageWhereUniqueInput | LLMMessageWhereUniqueInput[]
    delete?: LLMMessageWhereUniqueInput | LLMMessageWhereUniqueInput[]
    connect?: LLMMessageWhereUniqueInput | LLMMessageWhereUniqueInput[]
    update?: LLMMessageUpdateWithWhereUniqueWithoutConversationInput | LLMMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: LLMMessageUpdateManyWithWhereWithoutConversationInput | LLMMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: LLMMessageScalarWhereInput | LLMMessageScalarWhereInput[]
  }

  export type LLMMessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<LLMMessageCreateWithoutConversationInput, LLMMessageUncheckedCreateWithoutConversationInput> | LLMMessageCreateWithoutConversationInput[] | LLMMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: LLMMessageCreateOrConnectWithoutConversationInput | LLMMessageCreateOrConnectWithoutConversationInput[]
    upsert?: LLMMessageUpsertWithWhereUniqueWithoutConversationInput | LLMMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: LLMMessageCreateManyConversationInputEnvelope
    set?: LLMMessageWhereUniqueInput | LLMMessageWhereUniqueInput[]
    disconnect?: LLMMessageWhereUniqueInput | LLMMessageWhereUniqueInput[]
    delete?: LLMMessageWhereUniqueInput | LLMMessageWhereUniqueInput[]
    connect?: LLMMessageWhereUniqueInput | LLMMessageWhereUniqueInput[]
    update?: LLMMessageUpdateWithWhereUniqueWithoutConversationInput | LLMMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: LLMMessageUpdateManyWithWhereWithoutConversationInput | LLMMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: LLMMessageScalarWhereInput | LLMMessageScalarWhereInput[]
  }

  export type LLMConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<LLMConversationCreateWithoutMessagesInput, LLMConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: LLMConversationCreateOrConnectWithoutMessagesInput
    connect?: LLMConversationWhereUniqueInput
  }

  export type EnumMessageRoleFieldUpdateOperationsInput = {
    set?: $Enums.MessageRole
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LLMConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<LLMConversationCreateWithoutMessagesInput, LLMConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: LLMConversationCreateOrConnectWithoutMessagesInput
    upsert?: LLMConversationUpsertWithoutMessagesInput
    connect?: LLMConversationWhereUniqueInput
    update?: XOR<XOR<LLMConversationUpdateToOneWithWhereWithoutMessagesInput, LLMConversationUpdateWithoutMessagesInput>, LLMConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type UserCreateNestedOneWithoutSharedAnalysesInput = {
    create?: XOR<UserCreateWithoutSharedAnalysesInput, UserUncheckedCreateWithoutSharedAnalysesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSharedAnalysesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSharedAnalysesNestedInput = {
    create?: XOR<UserCreateWithoutSharedAnalysesInput, UserUncheckedCreateWithoutSharedAnalysesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSharedAnalysesInput
    upsert?: UserUpsertWithoutSharedAnalysesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSharedAnalysesInput, UserUpdateWithoutSharedAnalysesInput>, UserUncheckedUpdateWithoutSharedAnalysesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumSubscriptionTierFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierFilter<$PrismaModel> | $Enums.SubscriptionTier
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumSubscriptionTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionTierFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionTierFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumUsageActionFilter<$PrismaModel = never> = {
    equals?: $Enums.UsageAction | EnumUsageActionFieldRefInput<$PrismaModel>
    in?: $Enums.UsageAction[] | ListEnumUsageActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.UsageAction[] | ListEnumUsageActionFieldRefInput<$PrismaModel>
    not?: NestedEnumUsageActionFilter<$PrismaModel> | $Enums.UsageAction
  }

  export type NestedEnumUsageActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UsageAction | EnumUsageActionFieldRefInput<$PrismaModel>
    in?: $Enums.UsageAction[] | ListEnumUsageActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.UsageAction[] | ListEnumUsageActionFieldRefInput<$PrismaModel>
    not?: NestedEnumUsageActionWithAggregatesFilter<$PrismaModel> | $Enums.UsageAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUsageActionFilter<$PrismaModel>
    _max?: NestedEnumUsageActionFilter<$PrismaModel>
  }

  export type NestedEnumInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusFilter<$PrismaModel> | $Enums.InvoiceStatus
  }

  export type NestedEnumInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvoiceStatus | EnumInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvoiceStatus[] | ListEnumInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumInvoiceStatusFilter<$PrismaModel>
  }

  export type NestedEnumConversationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationType | EnumConversationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationType[] | ListEnumConversationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationType[] | ListEnumConversationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationTypeFilter<$PrismaModel> | $Enums.ConversationType
  }

  export type NestedEnumConversationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusFilter<$PrismaModel> | $Enums.ConversationStatus
  }

  export type NestedEnumConversationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationType | EnumConversationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationType[] | ListEnumConversationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationType[] | ListEnumConversationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationTypeWithAggregatesFilter<$PrismaModel> | $Enums.ConversationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationTypeFilter<$PrismaModel>
    _max?: NestedEnumConversationTypeFilter<$PrismaModel>
  }

  export type NestedEnumConversationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConversationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationStatusFilter<$PrismaModel>
    _max?: NestedEnumConversationStatusFilter<$PrismaModel>
  }

  export type NestedEnumMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole
  }

  export type NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.MessageRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageRoleFilter<$PrismaModel>
    _max?: NestedEnumMessageRoleFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DocumentCreateWithoutUserInput = {
    id?: string
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string | null
    sections?: DocumentCreatesectionsInput | string[]
    processedAt?: Date | string
    processingTime: number
    usageRecords?: UsageRecordCreateNestedManyWithoutDocumentInput
    llmConversations?: LLMConversationCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutUserInput = {
    id?: string
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string | null
    sections?: DocumentCreatesectionsInput | string[]
    processedAt?: Date | string
    processingTime: number
    usageRecords?: UsageRecordUncheckedCreateNestedManyWithoutDocumentInput
    llmConversations?: LLMConversationUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutUserInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput>
  }

  export type DocumentCreateManyUserInputEnvelope = {
    data: DocumentCreateManyUserInput | DocumentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UsageRecordCreateWithoutUserInput = {
    id?: string
    action: $Enums.UsageAction
    cost?: number
    creditsUsed?: number
    createdAt?: Date | string
    billingMonth: string
    document: DocumentCreateNestedOneWithoutUsageRecordsInput
  }

  export type UsageRecordUncheckedCreateWithoutUserInput = {
    id?: string
    documentId: string
    action: $Enums.UsageAction
    cost?: number
    creditsUsed?: number
    createdAt?: Date | string
    billingMonth: string
  }

  export type UsageRecordCreateOrConnectWithoutUserInput = {
    where: UsageRecordWhereUniqueInput
    create: XOR<UsageRecordCreateWithoutUserInput, UsageRecordUncheckedCreateWithoutUserInput>
  }

  export type UsageRecordCreateManyUserInputEnvelope = {
    data: UsageRecordCreateManyUserInput | UsageRecordCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type InvoiceCreateWithoutUserInput = {
    id?: string
    amount: number
    currency?: string
    status?: $Enums.InvoiceStatus
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    stripeInvoiceId?: string | null
    stripePaymentId?: string | null
    itemCount: number
    generatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type InvoiceUncheckedCreateWithoutUserInput = {
    id?: string
    amount: number
    currency?: string
    status?: $Enums.InvoiceStatus
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    stripeInvoiceId?: string | null
    stripePaymentId?: string | null
    itemCount: number
    generatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type InvoiceCreateOrConnectWithoutUserInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput>
  }

  export type InvoiceCreateManyUserInputEnvelope = {
    data: InvoiceCreateManyUserInput | InvoiceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LLMConversationCreateWithoutUserInput = {
    id?: string
    type: $Enums.ConversationType
    title?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
    document?: DocumentCreateNestedOneWithoutLlmConversationsInput
    messages?: LLMMessageCreateNestedManyWithoutConversationInput
  }

  export type LLMConversationUncheckedCreateWithoutUserInput = {
    id?: string
    type: $Enums.ConversationType
    title?: string | null
    documentId?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
    messages?: LLMMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type LLMConversationCreateOrConnectWithoutUserInput = {
    where: LLMConversationWhereUniqueInput
    create: XOR<LLMConversationCreateWithoutUserInput, LLMConversationUncheckedCreateWithoutUserInput>
  }

  export type LLMConversationCreateManyUserInputEnvelope = {
    data: LLMConversationCreateManyUserInput | LLMConversationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SharedAnalysisCreateWithoutUserInput = {
    id: string
    analysisData: string
    settings?: string | null
    viewCount?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SharedAnalysisUncheckedCreateWithoutUserInput = {
    id: string
    analysisData: string
    settings?: string | null
    viewCount?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SharedAnalysisCreateOrConnectWithoutUserInput = {
    where: SharedAnalysisWhereUniqueInput
    create: XOR<SharedAnalysisCreateWithoutUserInput, SharedAnalysisUncheckedCreateWithoutUserInput>
  }

  export type SharedAnalysisCreateManyUserInputEnvelope = {
    data: SharedAnalysisCreateManyUserInput | SharedAnalysisCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type DocumentUpsertWithWhereUniqueWithoutUserInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutUserInput, DocumentUncheckedUpdateWithoutUserInput>
    create: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutUserInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutUserInput, DocumentUncheckedUpdateWithoutUserInput>
  }

  export type DocumentUpdateManyWithWhereWithoutUserInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutUserInput>
  }

  export type DocumentScalarWhereInput = {
    AND?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    OR?: DocumentScalarWhereInput[]
    NOT?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    id?: StringFilter<"Document"> | string
    userId?: StringNullableFilter<"Document"> | string | null
    filename?: StringFilter<"Document"> | string
    originalSize?: IntFilter<"Document"> | number
    fileHash?: StringFilter<"Document"> | string
    mimeType?: StringFilter<"Document"> | string
    extractedText?: StringFilter<"Document"> | string
    wordCount?: IntFilter<"Document"> | number
    pageCount?: IntFilter<"Document"> | number
    aiProvider?: StringFilter<"Document"> | string
    extractionCost?: FloatFilter<"Document"> | number
    summary?: StringNullableFilter<"Document"> | string | null
    sections?: StringNullableListFilter<"Document">
    processedAt?: DateTimeFilter<"Document"> | Date | string
    processingTime?: IntFilter<"Document"> | number
  }

  export type UsageRecordUpsertWithWhereUniqueWithoutUserInput = {
    where: UsageRecordWhereUniqueInput
    update: XOR<UsageRecordUpdateWithoutUserInput, UsageRecordUncheckedUpdateWithoutUserInput>
    create: XOR<UsageRecordCreateWithoutUserInput, UsageRecordUncheckedCreateWithoutUserInput>
  }

  export type UsageRecordUpdateWithWhereUniqueWithoutUserInput = {
    where: UsageRecordWhereUniqueInput
    data: XOR<UsageRecordUpdateWithoutUserInput, UsageRecordUncheckedUpdateWithoutUserInput>
  }

  export type UsageRecordUpdateManyWithWhereWithoutUserInput = {
    where: UsageRecordScalarWhereInput
    data: XOR<UsageRecordUpdateManyMutationInput, UsageRecordUncheckedUpdateManyWithoutUserInput>
  }

  export type UsageRecordScalarWhereInput = {
    AND?: UsageRecordScalarWhereInput | UsageRecordScalarWhereInput[]
    OR?: UsageRecordScalarWhereInput[]
    NOT?: UsageRecordScalarWhereInput | UsageRecordScalarWhereInput[]
    id?: StringFilter<"UsageRecord"> | string
    userId?: StringFilter<"UsageRecord"> | string
    documentId?: StringFilter<"UsageRecord"> | string
    action?: EnumUsageActionFilter<"UsageRecord"> | $Enums.UsageAction
    cost?: FloatFilter<"UsageRecord"> | number
    creditsUsed?: IntFilter<"UsageRecord"> | number
    createdAt?: DateTimeFilter<"UsageRecord"> | Date | string
    billingMonth?: StringFilter<"UsageRecord"> | string
  }

  export type InvoiceUpsertWithWhereUniqueWithoutUserInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutUserInput, InvoiceUncheckedUpdateWithoutUserInput>
    create: XOR<InvoiceCreateWithoutUserInput, InvoiceUncheckedCreateWithoutUserInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutUserInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutUserInput, InvoiceUncheckedUpdateWithoutUserInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutUserInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutUserInput>
  }

  export type InvoiceScalarWhereInput = {
    AND?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    OR?: InvoiceScalarWhereInput[]
    NOT?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    id?: StringFilter<"Invoice"> | string
    userId?: StringFilter<"Invoice"> | string
    amount?: FloatFilter<"Invoice"> | number
    currency?: StringFilter<"Invoice"> | string
    status?: EnumInvoiceStatusFilter<"Invoice"> | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeFilter<"Invoice"> | Date | string
    billingPeriodEnd?: DateTimeFilter<"Invoice"> | Date | string
    stripeInvoiceId?: StringNullableFilter<"Invoice"> | string | null
    stripePaymentId?: StringNullableFilter<"Invoice"> | string | null
    itemCount?: IntFilter<"Invoice"> | number
    generatedAt?: DateTimeFilter<"Invoice"> | Date | string
    paidAt?: DateTimeNullableFilter<"Invoice"> | Date | string | null
  }

  export type LLMConversationUpsertWithWhereUniqueWithoutUserInput = {
    where: LLMConversationWhereUniqueInput
    update: XOR<LLMConversationUpdateWithoutUserInput, LLMConversationUncheckedUpdateWithoutUserInput>
    create: XOR<LLMConversationCreateWithoutUserInput, LLMConversationUncheckedCreateWithoutUserInput>
  }

  export type LLMConversationUpdateWithWhereUniqueWithoutUserInput = {
    where: LLMConversationWhereUniqueInput
    data: XOR<LLMConversationUpdateWithoutUserInput, LLMConversationUncheckedUpdateWithoutUserInput>
  }

  export type LLMConversationUpdateManyWithWhereWithoutUserInput = {
    where: LLMConversationScalarWhereInput
    data: XOR<LLMConversationUpdateManyMutationInput, LLMConversationUncheckedUpdateManyWithoutUserInput>
  }

  export type LLMConversationScalarWhereInput = {
    AND?: LLMConversationScalarWhereInput | LLMConversationScalarWhereInput[]
    OR?: LLMConversationScalarWhereInput[]
    NOT?: LLMConversationScalarWhereInput | LLMConversationScalarWhereInput[]
    id?: StringFilter<"LLMConversation"> | string
    userId?: StringNullableFilter<"LLMConversation"> | string | null
    type?: EnumConversationTypeFilter<"LLMConversation"> | $Enums.ConversationType
    title?: StringNullableFilter<"LLMConversation"> | string | null
    documentId?: StringNullableFilter<"LLMConversation"> | string | null
    provider?: StringFilter<"LLMConversation"> | string
    model?: StringFilter<"LLMConversation"> | string
    totalTokensUsed?: IntFilter<"LLMConversation"> | number
    totalCost?: FloatFilter<"LLMConversation"> | number
    createdAt?: DateTimeFilter<"LLMConversation"> | Date | string
    updatedAt?: DateTimeFilter<"LLMConversation"> | Date | string
    completedAt?: DateTimeNullableFilter<"LLMConversation"> | Date | string | null
    status?: EnumConversationStatusFilter<"LLMConversation"> | $Enums.ConversationStatus
    errorMessage?: StringNullableFilter<"LLMConversation"> | string | null
  }

  export type SharedAnalysisUpsertWithWhereUniqueWithoutUserInput = {
    where: SharedAnalysisWhereUniqueInput
    update: XOR<SharedAnalysisUpdateWithoutUserInput, SharedAnalysisUncheckedUpdateWithoutUserInput>
    create: XOR<SharedAnalysisCreateWithoutUserInput, SharedAnalysisUncheckedCreateWithoutUserInput>
  }

  export type SharedAnalysisUpdateWithWhereUniqueWithoutUserInput = {
    where: SharedAnalysisWhereUniqueInput
    data: XOR<SharedAnalysisUpdateWithoutUserInput, SharedAnalysisUncheckedUpdateWithoutUserInput>
  }

  export type SharedAnalysisUpdateManyWithWhereWithoutUserInput = {
    where: SharedAnalysisScalarWhereInput
    data: XOR<SharedAnalysisUpdateManyMutationInput, SharedAnalysisUncheckedUpdateManyWithoutUserInput>
  }

  export type SharedAnalysisScalarWhereInput = {
    AND?: SharedAnalysisScalarWhereInput | SharedAnalysisScalarWhereInput[]
    OR?: SharedAnalysisScalarWhereInput[]
    NOT?: SharedAnalysisScalarWhereInput | SharedAnalysisScalarWhereInput[]
    id?: StringFilter<"SharedAnalysis"> | string
    userId?: StringFilter<"SharedAnalysis"> | string
    analysisData?: StringFilter<"SharedAnalysis"> | string
    settings?: StringNullableFilter<"SharedAnalysis"> | string | null
    viewCount?: IntFilter<"SharedAnalysis"> | number
    expiresAt?: DateTimeFilter<"SharedAnalysis"> | Date | string
    createdAt?: DateTimeFilter<"SharedAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"SharedAnalysis"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationUncheckedCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUncheckedUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationUncheckedCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUncheckedUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutDocumentsInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDocumentsInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationUncheckedCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDocumentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
  }

  export type UsageRecordCreateWithoutDocumentInput = {
    id?: string
    action: $Enums.UsageAction
    cost?: number
    creditsUsed?: number
    createdAt?: Date | string
    billingMonth: string
    user: UserCreateNestedOneWithoutUsageRecordsInput
  }

  export type UsageRecordUncheckedCreateWithoutDocumentInput = {
    id?: string
    userId: string
    action: $Enums.UsageAction
    cost?: number
    creditsUsed?: number
    createdAt?: Date | string
    billingMonth: string
  }

  export type UsageRecordCreateOrConnectWithoutDocumentInput = {
    where: UsageRecordWhereUniqueInput
    create: XOR<UsageRecordCreateWithoutDocumentInput, UsageRecordUncheckedCreateWithoutDocumentInput>
  }

  export type UsageRecordCreateManyDocumentInputEnvelope = {
    data: UsageRecordCreateManyDocumentInput | UsageRecordCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type LLMConversationCreateWithoutDocumentInput = {
    id?: string
    type: $Enums.ConversationType
    title?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
    user?: UserCreateNestedOneWithoutLlmConversationsInput
    messages?: LLMMessageCreateNestedManyWithoutConversationInput
  }

  export type LLMConversationUncheckedCreateWithoutDocumentInput = {
    id?: string
    userId?: string | null
    type: $Enums.ConversationType
    title?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
    messages?: LLMMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type LLMConversationCreateOrConnectWithoutDocumentInput = {
    where: LLMConversationWhereUniqueInput
    create: XOR<LLMConversationCreateWithoutDocumentInput, LLMConversationUncheckedCreateWithoutDocumentInput>
  }

  export type LLMConversationCreateManyDocumentInputEnvelope = {
    data: LLMConversationCreateManyDocumentInput | LLMConversationCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutDocumentsInput = {
    update: XOR<UserUpdateWithoutDocumentsInput, UserUncheckedUpdateWithoutDocumentsInput>
    create: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDocumentsInput, UserUncheckedUpdateWithoutDocumentsInput>
  }

  export type UserUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUncheckedUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UsageRecordUpsertWithWhereUniqueWithoutDocumentInput = {
    where: UsageRecordWhereUniqueInput
    update: XOR<UsageRecordUpdateWithoutDocumentInput, UsageRecordUncheckedUpdateWithoutDocumentInput>
    create: XOR<UsageRecordCreateWithoutDocumentInput, UsageRecordUncheckedCreateWithoutDocumentInput>
  }

  export type UsageRecordUpdateWithWhereUniqueWithoutDocumentInput = {
    where: UsageRecordWhereUniqueInput
    data: XOR<UsageRecordUpdateWithoutDocumentInput, UsageRecordUncheckedUpdateWithoutDocumentInput>
  }

  export type UsageRecordUpdateManyWithWhereWithoutDocumentInput = {
    where: UsageRecordScalarWhereInput
    data: XOR<UsageRecordUpdateManyMutationInput, UsageRecordUncheckedUpdateManyWithoutDocumentInput>
  }

  export type LLMConversationUpsertWithWhereUniqueWithoutDocumentInput = {
    where: LLMConversationWhereUniqueInput
    update: XOR<LLMConversationUpdateWithoutDocumentInput, LLMConversationUncheckedUpdateWithoutDocumentInput>
    create: XOR<LLMConversationCreateWithoutDocumentInput, LLMConversationUncheckedCreateWithoutDocumentInput>
  }

  export type LLMConversationUpdateWithWhereUniqueWithoutDocumentInput = {
    where: LLMConversationWhereUniqueInput
    data: XOR<LLMConversationUpdateWithoutDocumentInput, LLMConversationUncheckedUpdateWithoutDocumentInput>
  }

  export type LLMConversationUpdateManyWithWhereWithoutDocumentInput = {
    where: LLMConversationScalarWhereInput
    data: XOR<LLMConversationUpdateManyMutationInput, LLMConversationUncheckedUpdateManyWithoutDocumentInput>
  }

  export type UserCreateWithoutUsageRecordsInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUsageRecordsInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationUncheckedCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUsageRecordsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUsageRecordsInput, UserUncheckedCreateWithoutUsageRecordsInput>
  }

  export type DocumentCreateWithoutUsageRecordsInput = {
    id?: string
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string | null
    sections?: DocumentCreatesectionsInput | string[]
    processedAt?: Date | string
    processingTime: number
    user?: UserCreateNestedOneWithoutDocumentsInput
    llmConversations?: LLMConversationCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutUsageRecordsInput = {
    id?: string
    userId?: string | null
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string | null
    sections?: DocumentCreatesectionsInput | string[]
    processedAt?: Date | string
    processingTime: number
    llmConversations?: LLMConversationUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutUsageRecordsInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutUsageRecordsInput, DocumentUncheckedCreateWithoutUsageRecordsInput>
  }

  export type UserUpsertWithoutUsageRecordsInput = {
    update: XOR<UserUpdateWithoutUsageRecordsInput, UserUncheckedUpdateWithoutUsageRecordsInput>
    create: XOR<UserCreateWithoutUsageRecordsInput, UserUncheckedCreateWithoutUsageRecordsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUsageRecordsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUsageRecordsInput, UserUncheckedUpdateWithoutUsageRecordsInput>
  }

  export type UserUpdateWithoutUsageRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUsageRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUncheckedUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DocumentUpsertWithoutUsageRecordsInput = {
    update: XOR<DocumentUpdateWithoutUsageRecordsInput, DocumentUncheckedUpdateWithoutUsageRecordsInput>
    create: XOR<DocumentCreateWithoutUsageRecordsInput, DocumentUncheckedCreateWithoutUsageRecordsInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutUsageRecordsInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutUsageRecordsInput, DocumentUncheckedUpdateWithoutUsageRecordsInput>
  }

  export type DocumentUpdateWithoutUsageRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneWithoutDocumentsNestedInput
    llmConversations?: LLMConversationUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutUsageRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
    llmConversations?: LLMConversationUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type UserCreateWithoutInvoicesInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutInvoicesInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordUncheckedCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationUncheckedCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutInvoicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
  }

  export type UserUpsertWithoutInvoicesInput = {
    update: XOR<UserUpdateWithoutInvoicesInput, UserUncheckedUpdateWithoutInvoicesInput>
    create: XOR<UserCreateWithoutInvoicesInput, UserUncheckedCreateWithoutInvoicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInvoicesInput, UserUncheckedUpdateWithoutInvoicesInput>
  }

  export type UserUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUncheckedUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUncheckedUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutLlmConversationsInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLlmConversationsInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    sharedAnalyses?: SharedAnalysisUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLlmConversationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLlmConversationsInput, UserUncheckedCreateWithoutLlmConversationsInput>
  }

  export type DocumentCreateWithoutLlmConversationsInput = {
    id?: string
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string | null
    sections?: DocumentCreatesectionsInput | string[]
    processedAt?: Date | string
    processingTime: number
    user?: UserCreateNestedOneWithoutDocumentsInput
    usageRecords?: UsageRecordCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutLlmConversationsInput = {
    id?: string
    userId?: string | null
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string | null
    sections?: DocumentCreatesectionsInput | string[]
    processedAt?: Date | string
    processingTime: number
    usageRecords?: UsageRecordUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutLlmConversationsInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutLlmConversationsInput, DocumentUncheckedCreateWithoutLlmConversationsInput>
  }

  export type LLMMessageCreateWithoutConversationInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    inputTokens?: number | null
    outputTokens?: number | null
    totalTokens?: number | null
    cost?: number
    messageIndex: number
    processingTime?: number | null
    finishReason?: string | null
    temperature?: number | null
    maxTokens?: number | null
    createdAt?: Date | string
  }

  export type LLMMessageUncheckedCreateWithoutConversationInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    inputTokens?: number | null
    outputTokens?: number | null
    totalTokens?: number | null
    cost?: number
    messageIndex: number
    processingTime?: number | null
    finishReason?: string | null
    temperature?: number | null
    maxTokens?: number | null
    createdAt?: Date | string
  }

  export type LLMMessageCreateOrConnectWithoutConversationInput = {
    where: LLMMessageWhereUniqueInput
    create: XOR<LLMMessageCreateWithoutConversationInput, LLMMessageUncheckedCreateWithoutConversationInput>
  }

  export type LLMMessageCreateManyConversationInputEnvelope = {
    data: LLMMessageCreateManyConversationInput | LLMMessageCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutLlmConversationsInput = {
    update: XOR<UserUpdateWithoutLlmConversationsInput, UserUncheckedUpdateWithoutLlmConversationsInput>
    create: XOR<UserCreateWithoutLlmConversationsInput, UserUncheckedCreateWithoutLlmConversationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLlmConversationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLlmConversationsInput, UserUncheckedUpdateWithoutLlmConversationsInput>
  }

  export type UserUpdateWithoutLlmConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLlmConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    sharedAnalyses?: SharedAnalysisUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DocumentUpsertWithoutLlmConversationsInput = {
    update: XOR<DocumentUpdateWithoutLlmConversationsInput, DocumentUncheckedUpdateWithoutLlmConversationsInput>
    create: XOR<DocumentCreateWithoutLlmConversationsInput, DocumentUncheckedCreateWithoutLlmConversationsInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutLlmConversationsInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutLlmConversationsInput, DocumentUncheckedUpdateWithoutLlmConversationsInput>
  }

  export type DocumentUpdateWithoutLlmConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneWithoutDocumentsNestedInput
    usageRecords?: UsageRecordUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutLlmConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
    usageRecords?: UsageRecordUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type LLMMessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: LLMMessageWhereUniqueInput
    update: XOR<LLMMessageUpdateWithoutConversationInput, LLMMessageUncheckedUpdateWithoutConversationInput>
    create: XOR<LLMMessageCreateWithoutConversationInput, LLMMessageUncheckedCreateWithoutConversationInput>
  }

  export type LLMMessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: LLMMessageWhereUniqueInput
    data: XOR<LLMMessageUpdateWithoutConversationInput, LLMMessageUncheckedUpdateWithoutConversationInput>
  }

  export type LLMMessageUpdateManyWithWhereWithoutConversationInput = {
    where: LLMMessageScalarWhereInput
    data: XOR<LLMMessageUpdateManyMutationInput, LLMMessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type LLMMessageScalarWhereInput = {
    AND?: LLMMessageScalarWhereInput | LLMMessageScalarWhereInput[]
    OR?: LLMMessageScalarWhereInput[]
    NOT?: LLMMessageScalarWhereInput | LLMMessageScalarWhereInput[]
    id?: StringFilter<"LLMMessage"> | string
    conversationId?: StringFilter<"LLMMessage"> | string
    role?: EnumMessageRoleFilter<"LLMMessage"> | $Enums.MessageRole
    content?: StringFilter<"LLMMessage"> | string
    inputTokens?: IntNullableFilter<"LLMMessage"> | number | null
    outputTokens?: IntNullableFilter<"LLMMessage"> | number | null
    totalTokens?: IntNullableFilter<"LLMMessage"> | number | null
    cost?: FloatFilter<"LLMMessage"> | number
    messageIndex?: IntFilter<"LLMMessage"> | number
    processingTime?: IntNullableFilter<"LLMMessage"> | number | null
    finishReason?: StringNullableFilter<"LLMMessage"> | string | null
    temperature?: FloatNullableFilter<"LLMMessage"> | number | null
    maxTokens?: IntNullableFilter<"LLMMessage"> | number | null
    createdAt?: DateTimeFilter<"LLMMessage"> | Date | string
  }

  export type LLMConversationCreateWithoutMessagesInput = {
    id?: string
    type: $Enums.ConversationType
    title?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
    user?: UserCreateNestedOneWithoutLlmConversationsInput
    document?: DocumentCreateNestedOneWithoutLlmConversationsInput
  }

  export type LLMConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    userId?: string | null
    type: $Enums.ConversationType
    title?: string | null
    documentId?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
  }

  export type LLMConversationCreateOrConnectWithoutMessagesInput = {
    where: LLMConversationWhereUniqueInput
    create: XOR<LLMConversationCreateWithoutMessagesInput, LLMConversationUncheckedCreateWithoutMessagesInput>
  }

  export type LLMConversationUpsertWithoutMessagesInput = {
    update: XOR<LLMConversationUpdateWithoutMessagesInput, LLMConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<LLMConversationCreateWithoutMessagesInput, LLMConversationUncheckedCreateWithoutMessagesInput>
    where?: LLMConversationWhereInput
  }

  export type LLMConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: LLMConversationWhereInput
    data: XOR<LLMConversationUpdateWithoutMessagesInput, LLMConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type LLMConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutLlmConversationsNestedInput
    document?: DocumentUpdateOneWithoutLlmConversationsNestedInput
  }

  export type LLMConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateWithoutSharedAnalysesInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordCreateNestedManyWithoutUserInput
    invoices?: InvoiceCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSharedAnalysesInput = {
    id?: string
    email: string
    name?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    hashedPassword?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionId?: string | null
    customerId?: string | null
    subscriptionEndsAt?: Date | string | null
    monthlyRoasts?: number
    totalRoasts?: number
    lastRoastReset?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    usageRecords?: UsageRecordUncheckedCreateNestedManyWithoutUserInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutUserInput
    llmConversations?: LLMConversationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSharedAnalysesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSharedAnalysesInput, UserUncheckedCreateWithoutSharedAnalysesInput>
  }

  export type UserUpsertWithoutSharedAnalysesInput = {
    update: XOR<UserUpdateWithoutSharedAnalysesInput, UserUncheckedUpdateWithoutSharedAnalysesInput>
    create: XOR<UserCreateWithoutSharedAnalysesInput, UserUncheckedCreateWithoutSharedAnalysesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSharedAnalysesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSharedAnalysesInput, UserUncheckedUpdateWithoutSharedAnalysesInput>
  }

  export type UserUpdateWithoutSharedAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSharedAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    hashedPassword?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRoasts?: IntFieldUpdateOperationsInput | number
    totalRoasts?: IntFieldUpdateOperationsInput | number
    lastRoastReset?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    usageRecords?: UsageRecordUncheckedUpdateManyWithoutUserNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutUserNestedInput
    llmConversations?: LLMConversationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateManyUserInput = {
    id?: string
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string | null
    sections?: DocumentCreatesectionsInput | string[]
    processedAt?: Date | string
    processingTime: number
  }

  export type UsageRecordCreateManyUserInput = {
    id?: string
    documentId: string
    action: $Enums.UsageAction
    cost?: number
    creditsUsed?: number
    createdAt?: Date | string
    billingMonth: string
  }

  export type InvoiceCreateManyUserInput = {
    id?: string
    amount: number
    currency?: string
    status?: $Enums.InvoiceStatus
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    stripeInvoiceId?: string | null
    stripePaymentId?: string | null
    itemCount: number
    generatedAt?: Date | string
    paidAt?: Date | string | null
  }

  export type LLMConversationCreateManyUserInput = {
    id?: string
    type: $Enums.ConversationType
    title?: string | null
    documentId?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
  }

  export type SharedAnalysisCreateManyUserInput = {
    id: string
    analysisData: string
    settings?: string | null
    viewCount?: number
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
    usageRecords?: UsageRecordUpdateManyWithoutDocumentNestedInput
    llmConversations?: LLMConversationUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
    usageRecords?: UsageRecordUncheckedUpdateManyWithoutDocumentNestedInput
    llmConversations?: LLMConversationUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalSize?: IntFieldUpdateOperationsInput | number
    fileHash?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    extractedText?: StringFieldUpdateOperationsInput | string
    wordCount?: IntFieldUpdateOperationsInput | number
    pageCount?: IntFieldUpdateOperationsInput | number
    aiProvider?: StringFieldUpdateOperationsInput | string
    extractionCost?: FloatFieldUpdateOperationsInput | number
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    sections?: DocumentUpdatesectionsInput | string[]
    processedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingTime?: IntFieldUpdateOperationsInput | number
  }

  export type UsageRecordUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumUsageActionFieldUpdateOperationsInput | $Enums.UsageAction
    cost?: FloatFieldUpdateOperationsInput | number
    creditsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingMonth?: StringFieldUpdateOperationsInput | string
    document?: DocumentUpdateOneRequiredWithoutUsageRecordsNestedInput
  }

  export type UsageRecordUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    action?: EnumUsageActionFieldUpdateOperationsInput | $Enums.UsageAction
    cost?: FloatFieldUpdateOperationsInput | number
    creditsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingMonth?: StringFieldUpdateOperationsInput | string
  }

  export type UsageRecordUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    action?: EnumUsageActionFieldUpdateOperationsInput | $Enums.UsageAction
    cost?: FloatFieldUpdateOperationsInput | number
    creditsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingMonth?: StringFieldUpdateOperationsInput | string
  }

  export type InvoiceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    itemCount?: IntFieldUpdateOperationsInput | number
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    itemCount?: IntFieldUpdateOperationsInput | number
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InvoiceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: EnumInvoiceStatusFieldUpdateOperationsInput | $Enums.InvoiceStatus
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    itemCount?: IntFieldUpdateOperationsInput | number
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LLMConversationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    document?: DocumentUpdateOneWithoutLlmConversationsNestedInput
    messages?: LLMMessageUpdateManyWithoutConversationNestedInput
  }

  export type LLMConversationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: LLMMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type LLMConversationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SharedAnalysisUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    analysisData?: StringFieldUpdateOperationsInput | string
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    viewCount?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedAnalysisUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    analysisData?: StringFieldUpdateOperationsInput | string
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    viewCount?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedAnalysisUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    analysisData?: StringFieldUpdateOperationsInput | string
    settings?: NullableStringFieldUpdateOperationsInput | string | null
    viewCount?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageRecordCreateManyDocumentInput = {
    id?: string
    userId: string
    action: $Enums.UsageAction
    cost?: number
    creditsUsed?: number
    createdAt?: Date | string
    billingMonth: string
  }

  export type LLMConversationCreateManyDocumentInput = {
    id?: string
    userId?: string | null
    type: $Enums.ConversationType
    title?: string | null
    provider: string
    model: string
    totalTokensUsed?: number
    totalCost?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    status?: $Enums.ConversationStatus
    errorMessage?: string | null
  }

  export type UsageRecordUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumUsageActionFieldUpdateOperationsInput | $Enums.UsageAction
    cost?: FloatFieldUpdateOperationsInput | number
    creditsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingMonth?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutUsageRecordsNestedInput
  }

  export type UsageRecordUncheckedUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: EnumUsageActionFieldUpdateOperationsInput | $Enums.UsageAction
    cost?: FloatFieldUpdateOperationsInput | number
    creditsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingMonth?: StringFieldUpdateOperationsInput | string
  }

  export type UsageRecordUncheckedUpdateManyWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: EnumUsageActionFieldUpdateOperationsInput | $Enums.UsageAction
    cost?: FloatFieldUpdateOperationsInput | number
    creditsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingMonth?: StringFieldUpdateOperationsInput | string
  }

  export type LLMConversationUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutLlmConversationsNestedInput
    messages?: LLMMessageUpdateManyWithoutConversationNestedInput
  }

  export type LLMConversationUncheckedUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: LLMMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type LLMConversationUncheckedUpdateManyWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumConversationTypeFieldUpdateOperationsInput | $Enums.ConversationType
    title?: NullableStringFieldUpdateOperationsInput | string | null
    provider?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    totalTokensUsed?: IntFieldUpdateOperationsInput | number
    totalCost?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LLMMessageCreateManyConversationInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    inputTokens?: number | null
    outputTokens?: number | null
    totalTokens?: number | null
    cost?: number
    messageIndex: number
    processingTime?: number | null
    finishReason?: string | null
    temperature?: number | null
    maxTokens?: number | null
    createdAt?: Date | string
  }

  export type LLMMessageUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: FloatFieldUpdateOperationsInput | number
    messageIndex?: IntFieldUpdateOperationsInput | number
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    finishReason?: NullableStringFieldUpdateOperationsInput | string | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    maxTokens?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LLMMessageUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: FloatFieldUpdateOperationsInput | number
    messageIndex?: IntFieldUpdateOperationsInput | number
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    finishReason?: NullableStringFieldUpdateOperationsInput | string | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    maxTokens?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LLMMessageUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: FloatFieldUpdateOperationsInput | number
    messageIndex?: IntFieldUpdateOperationsInput | number
    processingTime?: NullableIntFieldUpdateOperationsInput | number | null
    finishReason?: NullableStringFieldUpdateOperationsInput | string | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    maxTokens?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}