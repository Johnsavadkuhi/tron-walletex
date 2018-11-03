import React from "react";
import ReactLoading from "react-loading";
import { Section } from "./generic";

const Loader = () => (

    <Section  className="loaderfirst" >

        <ReactLoading   type='bars' color="#fff" height={500} width={300}/>

    </Section>
);

export default Loader;
