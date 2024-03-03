/* eslint-disable prettier/prettier */
import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';
import { UsuarioEntidade } from '../Usuario.entity';
import { OpniaoEntidade } from '../opniao/opniao.entity';
//import { UsuarioEntidade } from '../Usuario.entity';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  entities:  [UsuarioEntidade, OpniaoEntidade],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  synchronize: true
};

const  dataSource = new DataSource(dataSourceOptions);
export default dataSource

