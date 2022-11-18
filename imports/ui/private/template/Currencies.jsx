import * as React from 'react';

import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import { Table } from 'react-bootstrap';
import Loader from 'rsuite/Loader';
import Title from './Title';

import { CurrenciesCollections } from '../../../db/Currencies';

export default function Currencies() {

  const formatNum = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(2)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};
  
  const [page, setPage] = React.useState(1);
	const [maxPage, setMaxPage] = React.useState(1);
	const [orderBy, setOrderBy] = React.useState('code');
	const [order, setOrder] = React.useState(1);

  const [currencies, currenciesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('currencies.listAll', {
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = CurrenciesCollections.find( 
      {}, 
      { sort: sortObject },
      { limit: 5	} ).fetch();

		return [data, !subs.ready()];
	}, [ orderBy, order]);

  return (
    <React.Fragment>
      <Title>{'Kurs Hari ini (' + moment(new Date()).format('DD/MM/YY') + ')'}</Title>
      <Table bordered responsive hover size="sm" style={{ fontSize: 12 }}>
        <thead>
          <tr>
            <th>Kode</th>
            <th style={{ textAlign: "right" }}>Nominal</th>
          </tr>
        </thead>
        <tbody>
          {currenciesLoading ? (
            <tr>
              <td colSpan={10}>
                <center>
                  <Loader
                    size="sm"
                    content="Loading Data..."
                  />
                </center>
              </td>
            </tr>
          ) : (
            <>
              {currencies.length > 0 ? (
                <>
                  {currencies.map((item, index) => (
                    <tr key={index}>
                      <td>{item.code}</td>
                      <td style={{ textAlign: "right" }}> {formatNum(item.kurs)}</td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={10}>
                    <center>Tidak ada data</center>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </Table>
    </React.Fragment>
  );
}