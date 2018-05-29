import React from "react";
import {injectIntl} from "react-intl";

const WalletOption = ({ name, intl }) => (
    <option value={name}>
        {name}
    </option>
);


export default injectIntl(WalletOption);