/**
 * Cineast RESTful API
 * Cineast is vitrivr\'s content-based multimedia retrieval engine. This is it\'s RESTful API.
 *
 * The version of the OpenAPI document: v1
 * Contact: contact@vitrivr.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface QueryTerm { 
    type?: QueryTerm.TypeEnum;
    data?: string;
    categories?: Array<string>;
}
export namespace QueryTerm {
    export type TypeEnum = 'IMAGE' | 'AUDIO' | 'MOTION' | 'MODEL3D' | 'LOCATION' | 'TIME' | 'TEXT' | 'TAG' | 'SEMANTIC' | 'ID' | 'BOOLEAN';
    export const TypeEnum = {
        IMAGE: 'IMAGE' as TypeEnum,
        AUDIO: 'AUDIO' as TypeEnum,
        MOTION: 'MOTION' as TypeEnum,
        MODEL3D: 'MODEL3D' as TypeEnum,
        LOCATION: 'LOCATION' as TypeEnum,
        TIME: 'TIME' as TypeEnum,
        TEXT: 'TEXT' as TypeEnum,
        TAG: 'TAG' as TypeEnum,
        SEMANTIC: 'SEMANTIC' as TypeEnum,
        ID: 'ID' as TypeEnum,
        BOOLEAN: 'BOOLEAN' as TypeEnum
    };
}


