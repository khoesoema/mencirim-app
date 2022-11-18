import * as React from 'react';

import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import { Table } from 'react-bootstrap';
import Loader from 'rsuite/Loader';
import Title from './Title';

import { ProductsCollections } from '../../../db/Products';

export default function SoldOut() {

  const [products, productsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('products.countZero', {});

		let data = ProductsCollections.find({}).fetch();
		
		return [data, !subs.ready()];
	}, []);
  
  return (
    <React.Fragment>
      <Title>Barang yang sudah sold out</Title>
      <Table responsive bordered={false} hover size="sm" style={{ fontSize: 10 }}>
        <tbody>
          {productsLoading
            ? (<tr>
              <td colSpan={2}>
                <center>
                  <Loader
                    size="sm"
                    content="Memuat Data..."
                  />
                </center>
              </td>
            </tr>
            ) : (
              <>
                {products.length > 0
                  ? (
                    <>
                      {products.map((item, index) => (
                        <tr key={index}>
                          <td>{item.namaBarang}</td>
                          <td style={{ textAlign: "right" }}> {moment(item.tglLastTrx).format('YYYY-MM-DD')}</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={2}>
                        <center>Tidak ada data</center>
                      </td>
                    </tr>
                  )}
              </>
            )
          }
        </tbody>
      </Table>
    </React.Fragment>
  );
}