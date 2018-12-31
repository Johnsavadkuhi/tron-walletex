import React from "react";
import {injectIntl} from "react-intl";
import MenuItem from "@material-ui/core/MenuItem";

const SendOption = ({ name, balance, intl }) => (

    <option value={name}>

    {name} ({intl.formatNumber(balance)} {intl.formatMessage({ id: "available" })})

  </option>

);



//export default  injectIntl(SendMenuElement);
export default injectIntl(SendOption);
