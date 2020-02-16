import { Router } from 'express';
import moment from 'moment';

type Wrapper = (router: Router) => void;

export const applyMiddleware = (
  middlewareWrappers: Wrapper[],
  router: Router
) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

export const epoch = () => {
  return new Date().getTime();
};

export const timestamp = () => {
  return new Date();
};

export const timestampWithFormat = (format: string) => {
  return moment(timestamp()).format(format);
};

export const isAValidEnum = (event: string | string[], EnumObject: object) => {
  if (isArrayInstanceOf(event)) {
    for (const str of event) {
      if (!Object.values(EnumObject).includes(str)) {
        return false;
      }
    }
    return true;
  } else {
    return Object.values(EnumObject).includes(event);
  }
};

export const isArrayInstanceOf = (objToCheck: any) => {
  return objToCheck instanceof Array;
};

export const stringToInt = (stringVal: string) => {
  return parseInt(stringVal, 10);
};

export const intToString = (intVal: number) => {
  return intVal.toString();
};

export const trim = (stringVal: string): string => {
  return stringVal ? stringVal.trim() : '';
};

export const isNonEmptyString = (stringVal: string): boolean => {
  return (
    stringVal !== null && stringVal !== undefined && trim(stringVal) !== ''
  );
};
