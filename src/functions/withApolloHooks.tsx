import {ReactiveVar, useReactiveVar} from "@apollo/client";
import React from "react";

export const withApolloHooksHOC = (
    Component: any,
    apolloVar: ReactiveVar<any>[],
    propName: string[]
) => {
    return (props: any) => {
        let additionalProps = {};

        apolloVar.forEach((v, i) => {
            additionalProps[propName[i]] = useReactiveVar(v);
        });

        // additionalProps[propName] = useReactiveVar(apolloVar);
        return <Component {...additionalProps} {...props} />;
    };
};
