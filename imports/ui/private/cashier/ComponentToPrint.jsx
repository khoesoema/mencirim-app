import * as React from 'react';

// Using a functional component, you must wrap it in React.forwardRef, and then forward the ref to
// the node you want to be the root of the print (usually the outer most node in the ComponentToPrint)
// https://reactjs.org/docs/refs-and-the-dom.html#refs-and-function-components
export const ComponentToPrint = React.forwardRef((props, ref) => {

  return (
    <div ref={ref}>
      <div style={{ width:280, margin:8}}>
        <div className="text-center">Mencirim Swalayan</div>
        <div className="text-center">{'( Cv. Mantap Agung Sejati )'}</div>
        <div className="text-center">NPWP : 91.264640.3-125.000</div>
        <div className="text-center">JL. SEI MENCIRIM DUSUN III</div>
        <div >No.</div>
        <div >dd-mm-yyyy</div>
        <table>
          <thead>
            <th>KodeBrg</th>
            <th>NamaBarang</th>
          </thead>
          <tbody>
            <tr>
              <td>00008013</td>
              <td>GOLDEN NUMBER 111 BIRU BERAS 10</td>
            </tr>
            <tr>
              <td>8</td>
              <td>@141.750</td>
              <td>1.134.0000</td>
            </tr>
            <tr>
              <td>data 1</td>
              <td>data 2</td>
            </tr>
          </tbody>
        </table>
        <div className="text-center">BARANG YANG SUDAH DIBELI</div>
        <div className="text-center">TIDAK DAPAT DITUKAR/DIKEMBALIKAN</div>
        <div className="text-center">TERIMA KASIH</div>
      </div>
    </div>
  );
});