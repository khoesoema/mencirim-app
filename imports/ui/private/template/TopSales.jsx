import * as React from 'react';

import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import { Table } from 'react-bootstrap';
import Loader from 'rsuite/Loader';
import Title from './Title';

import { ProductsHistoriesCollections } from '../../../db/Products';

export default function TopSales() {

  const [productshistories, productshistoriesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('productshistories.countBrg', {});

		let data = ProductsHistoriesCollections.find(
			{},
			{
				sort: {jumlah: -1}
			},
			{
				limit: 10
			}
		).fetch();
		
		return [data, !subs.ready()];
	}, []);

  return (
    <React.Fragment>
      <Title>Top Penjualan Barang Bulan {moment(new Date()).format('MMMM')}</Title>
      <Table responsive bordered={false} hover size="sm" style={{fontSize: 12}}>
		  		<tbody>
		  	 	{productshistoriesLoading 
		  			? ( <tr>
		  					<td colSpan={2}>
		  						<center>
		  							<Loader
		  								size="sm"
		  								content="Memuat Data..."
		  							/>
		  						</center>
		  					</td>
		  				</tr> )
		  			: ( <>
		  				{productshistories.length > 0 
		  					? (
		  						<>
		  							{productshistories.map((item, index) => (
		  								<tr key={index}>
		  									<td>{item.nama}</td>
		  									<td style={{ textAlign: "right" }}> {item.jumlah}</td>
		  								</tr>
		  							))}
		  						</>
		  					) 
		  					: (
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