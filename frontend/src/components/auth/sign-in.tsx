'use client'

import { Descope } from "@descope/nextjs-sdk";

function SignInComponent(){
    return (
        <div className="descope-wrap">
            <Descope
             flowId="sign-up-or-in"
             autoFocus ="skipFirstScreen"
            />

        </div>
    );
}

export default SignInComponent;