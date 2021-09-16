import React from 'react';
import classes from './app.module.scss';
import { Calculator } from './calculator/Calculator';

export const App = () => (
  <div className={classes.App}>
    <Calculator />
  </div>
);
