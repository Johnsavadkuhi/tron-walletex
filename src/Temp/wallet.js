import {tu} from "../utils/i18n";

<div className="row mt-4">


    <div className="col-md-3"> </div>
    <div className="col-md-6">

        <label>{tu("wallet")}</label>

        <div className="input-group mb-3">

            <select
                className="form-control"
                onChange={this.handleChange}
                value={selectedWallet}>

                <option  name="Select your Wallet">Select your Wallet</option>
                {
                    this.props.wallets.map((wallet)=>(
                        <option key ={wallet.name} value={wallet.address} >
                            {wallet.address}
                        </option>

                    ))
                }

            </select>


        </div>
    </div>
    <div className="col-md-3"> </div>



</div>