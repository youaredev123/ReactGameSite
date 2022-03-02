import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../state/actions';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import MaterialTable from 'material-table'
import i18n from "i18next";


const styles = theme => ({

})

class WalletHistory extends Component {

  state = {
    current_lang: 'en'
  };

  componentDidMount() {
    this.getTransactionData();
    let current_lang = i18n.language;
    if(current_lang === 'in') {
      this.setState({current_lang: 'in'})
    }
  }

  getTransactionData = () => {
    let user_id = this.props.user_id;
    this.props.getTransactionHistory(user_id);
  }

  render() {
    const { transHistory, t } = this.props;
    if(transHistory) {
      transHistory.map(item => {
        item.Amount = item.Amount.toLocaleString();
        item.main_balance = item.main_balance.toLocaleString();
        return true;
      })
    }


    return (
      <div className="transaction-history" style={{ width: '90%', margin: '0 auto' }}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> {t('transactionform.label')}
              </CardHeader>
              <CardBody>
                <div style={{ maxWidth: '100%' }}>
                  {transHistory && this.state.current_lang === 'en' && (
                    <MaterialTable
                      title={t('transactionform.label')}
                      columns={[
                        { title: 'Amount', field: 'Amount' },
                        { title: 'Driections', field: 'Direction' },
                        { title: 'Main Balance', field: 'main_balance' },
                        { title: 'Transaction Date', field: 'created_at' }
                      ]}
                      data={transHistory}
                      actions={[

                      ]}
                      onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
                      options={{
                        actionsColumnIndex: -1,
                        headerStyle: {
                          backgroundColor: '#fff',
                          color: '#000',
                          textAlign: 'center'
                        },
                        cellStyle: { textAlign: 'center' },
                        rowStyle: rowData => ({
                          backgroundColor: (this.state.selectedRow && this.state.selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#FFF'
                        }),
                      }}
                    />
                  )}

                  {transHistory && this.state.current_lang === 'in' && (
                    <MaterialTable
                      title={t('transactionform.label')}
                      columns={[
                        { title: 'Jumlah', field: 'Amount' },
                        { title: 'Petunjuk arah', field: 'Direction' },
                        { title: 'Saldo utama', field: 'main_balance' },
                        { title: 'tanggal transaksi', field: 'created_at' }
                      ]}
                      data={transHistory}
                      actions={[

                      ]}
                      onRowClick={((evt, selectedRow) => this.setState({ selectedRow }))}
                      options={{
                        actionsColumnIndex: -1,
                        headerStyle: {
                          backgroundColor: '#fff',
                          color: '#000',
                          textAlign: 'center'
                        },
                        cellStyle: { textAlign: 'center' },
                        rowStyle: rowData => ({
                          backgroundColor: (this.state.selectedRow && this.state.selectedRow.tableData.id === rowData.tableData.id) ? '#EEE' : '#FFF'
                        }),
                      }}
                    />
                  )}

                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getTransactionHistory: Actions.getTransactionHistory,
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    transHistory: state.wallet.transHistory
  }
}


export default withTranslation()(withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(WalletHistory)));
