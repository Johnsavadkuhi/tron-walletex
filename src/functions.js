import React from 'react';
import TextField from '@material-ui/core/TextField';


export function passForm(){

    return(<form>

    {/*<TextField*/}
        {/*id="walletName"*/}
        {/*label="Name"*/}
        {/*className="text-center mr-1 bmd-label-static"*/}
        {/*margin="normal"*/}
    {/*/><br/>*/}

    <TextField

    type = "wPassword"
    required
    id = "password"
    label = "password"
    className = "text-center bmd-label-static mt-2"
    margin = "normal"
    />

        </form>

    );

}


export  function  _downloadTxtFile  ()  {
    let element = document.createElement("a");
    let file = new Blob([document.getElementById('wepassword').value], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myyFile.txt";
    element.click();
}

export function  downloadFile (_downloadTxtFile , value){

    console.log(value);

    return (

        <span>


            <input id="wepassword" type="hidden" value={value} />
            <button className="btn btn-info btn-sm " onClick={_downloadTxtFile}> Download password </button>

        </span>

    );
}

export function  createAlert(t)
{
    return (

        <div className="alert alert-danger font-weight-bold small" role="alert">
             {t}
    </div>);
}


export const myFunction = ()=> {
    var copyText = document.getElementById("walletPass");
    copyText.select();
    document.execCommand("copy");

    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied: " + copyText.value;
}

export const outFunc = ()=> {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
}