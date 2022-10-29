import React from "react";

export interface IHookObject {
  hook: any;
  name?: any;
  propName: string;
}

export const withHooksHoc = (Component: any, hooks: IHookObject[]) => {
  return (props: any) => {
    let additionalProps = {};

    hooks.forEach((v, i) => {
      v.name
        ? (additionalProps[v.propName] = v.hook(v.name))
        : (additionalProps[v.propName] = v.hook());
    });

    return <Component {...additionalProps} {...props} />;
  };
};
