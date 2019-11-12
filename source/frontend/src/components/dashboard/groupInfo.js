import React from 'react';
import Card from '@material-ui/core/Card';
import CardTitle from '@material-ui/core/Card';
// import translate from 'admin-on-rest';

const translate = require('translate');

const styles = {
    card: { borderLeft: 'solid 4px #31708f', flex: '1', marginRight: '1em' },
};

export default translate(({ value, translate }) => (
    <Card style={styles.card}>
        <CardTitle title={value} subtitle={translate('group')}/>
        <h>{value}</h>
    </Card>
));