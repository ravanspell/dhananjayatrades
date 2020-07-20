import React, { Fragment } from "react";
var Barcode = require("react-barcode");

class ComponentToPrint extends React.Component {
  render() {
    const m = this.props.Allbarcodes.map((barcode, i) => (
      <div key={i} className="m-2 bd-highlight">
        <Barcode options={{ height: 50 }} value={barcode} />
      </div>
    ));
    return (
      <Fragment>
        <div className="d-flex flex-row flex-wrap bd-highlight mb-3 mt-2">
          {m}
        </div>
      </Fragment>
    );
  }
}

export default ComponentToPrint;
