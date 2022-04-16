## Descripción

Puede probar esta API [aqui](https://api.luismalaga.online/)

## Requerimientos

-   node +14
-   npm
-   mysql

## Instalación

#### Variables de entorno

Cree un archivo llamado .env en la raiz del proyecto. Puede guiarse del ejemplo llamado .env-example:

-   DATABASE_USER=root
-   DATABASE_PASSWORD=
-   DATABASE_NAME=
-   DATABASE_HOST=
-   DATABASE_PORT=3306
-   API_HOST=localhost
-   API_PORT=5000
-   API_VERSION=v1
-   STRIPE_SK=
-   STRIPE_APIVERSION=2020-08-27

#### Instale los paquetes

###

```bash
$ npm install
```

## Ejecución

```bash
# development
$ npm run start:dev

```

## API ENDPOINST

Descripción de la Api

#### GET

`Read Payables` [/v1/payables](https://api.luismalaga.online/v1/payables)<br/>
`Read Transactions` [/v1/transactions](https://api.luismalaga.online/v1/transactions) <br/>

#### POST

`Create Payable` [/v1/payables](https://api.luismalaga.online/v1/payables) <br/>
`Create Transaction` [/v1/transactions](https://api.luismalaga.online/v1/transactions) <br/>

### Read Payables GET [/v1/payables](https://api.luismalaga.online/v1/payables)

Obtiene una paginación de payables en la base de datos. Se utilizan `Querys Params` para el filtrado de estas entidades.

**Query Params**

| Parametro | Required |               Tipo                | Descripción                                                                  |
| --------: | :------: | :-------------------------------: | ---------------------------------------------------------------------------- |
|    `page` | optional |              string               | Numero de página al que se desea acceder. <br/><br/> Default: `1`            |
|    `size` | optional |              string               | Numero de entidades que se desea obtener por página. <br/><br/> Default `10` |
| `service` | optional | `gas`,`energy`,`internet`,`water` | Si se indica el tipo de servicio; Solo se obtendran `payables` de ese tipo   |

GET `/v1/payables?size=3&page=1&service=internet`

**Respuesta**

```
{
	"items": [
		{
			"barCode": "495c0f3c-a6ea-4bd8-9805-07c20b3c76fb",
			"status": "pending",
			"dueDate": "2022-04-20T00:00:00.000Z",
			"serviceAmount": 1399.99,
			"description": "Pago por adelantado"
		},
		{
			"barCode": "8b8303dd-4f80-449b-ae1c-44fcd3dc6873",
			"status": "pending",
			"dueDate": "2022-04-20T00:00:00.000Z",
			"serviceAmount": 1299.99,
			"description": "Pago por adelantado"
		},
		{
			"barCode": "6b61189e-60f1-44cf-a854-327f2355810f",
			"status": "pending",
			"dueDate": "2022-04-20T00:00:00.000Z",
			"serviceAmount": 999.99,
			"description": "Pago por adelantado"
		}
	],
	"pages": 3
}

```

### Read Transactions GET [/v1/transactions](https://api.luismalaga.online/v1/transactions)

Obtiene una paginación de `transactions` en la base de datos. Se utilizan `Querys Params` para el filtrado de estas entidades.

**Query Params**

| Parametro | Required | Tipo | Descripción |
| --------: | :------: | :--: | ----------- |

| `start_date` | true | date | Fecha de inicio para filtrar `transactions` en un rango de fechas. <br/><br/> `start_date` de ser una fecha menor o igual a `end_date` |
| `end_date` | true | date | Fecha de fin para filtrar `transactions` en un rango de fechas. <br/><br/> `end_date` de ser una fecha Mayor o igual a `start_date` |

GET `/v1/transactions?start_date=2022-04-15&end_date=2022-04-17`

**Respuesta**

```
{
	"items": [
		{
			"2022-04-19T00:00:00.000Z": {
				"totalAmount": 7077.98,
				"totalTransactions": 2
			}
		},
		{
			"2022-04-18T00:00:00.000Z": {
				"totalAmount": 15050.909999999998,
				"totalTransactions": 9
			}
		},
		{
			"2022-04-17T00:00:00.000Z": {
				"totalAmount": 577.98,
				"totalTransactions": 2
			}
		},
		{
			"2022-04-15T00:00:00.000Z": {
				"totalAmount": 1438.99,
				"totalTransactions": 1
			}
		}
	]
}

```

### Create Payable POST [/v1/payables](https://api.luismalaga.online/v1/payables)

**Body**
| Parametro | Required | Tipo | Descripción |
| --------: | :------: | :-------------------------------: | ---------------------------------------------------------------------------- |
| `serviceAmount` | true | float | Importe del servicio |
| `dueDate` | true | date | Fecha de vencimiento |
| `service` | true | `energy`,`gas`,`water`,`internet` | Tipo de servicio |
| `description` | optional | string | Descrión del `payable` |

```
{
	"serviceAmount":3499.99,
	"dueDate":"2022-04-20",
	"service":"energy",
	"description":"Edenor S.A."
}
```

POST `/v1/payables`

**Respuesta**

```
{
	"barCode": "87b9d1f2-6249-4d97-935b-131a73416c94",
	"status": "pending",
	"serviceAmount": 3499.99,
	"dueDate": "2022-04-20T00:00:00.000Z",
	"service": "electric_energy",
	"description": "Edenor S.A.",
}
```

### Create Transaction POST [/v1/transactions](https://api.luismalaga.online/v1/transactions)

**Body**
| Parametro | Required | Tipo | Descripción |
| --------: | :------: | :-------------------------------: | ---------------------------------------------------------------------------- |
| `paymentAmount` | true | float | Importe de la `transaction` |
| `paymentDate` | true | date | | Fecha de pago de la `transaction`
| `barCode` | true | uuid | Código unico |
| `paymentMethod` | true | object | Indica el tipo de método de pago. <br/><br/> Si el tipo del método de pago es `cash` no se re requiere llenar los campos de la tarjeta |
| `paymentMethod.type` | true | `cash`,`card`,`store` | Tipo del método de pago|
| `paymentMethod.card_number` | optional ó true | string | Numero de la tarjeta. Requerido si el `type` es `card`|
| `paymentMethod.exp_month` | optional ó true | string | Mes de caducidad de la tarjeta. Requerido si el `type` es `card`|
| `paymentMethod.exp_year` | optional ó true | string| Año de caducidad de la tarjeta. Requerido si el `type` es `card`|
| `paymentMethod.holdername` | optional ó true | string| Titular de la tarjeta. Requerido si el `type` es `card`|

```
{
  "paymentAmount": 39.00,
  "barCode": "87b9d1f2-6249-4d97-935b-131a73416c94",
  "paymentDate": "2022-04-19",
  "paymentMethod": {
    "type": "card",
    "card_number": "4242424242424242",
    "exp_month": "4",
    "exp_year": "24",
    "holdername": "Luis Malaga"
  }
}
```

POST `/v1/transactions`

**Respuesta**

```
{
	"id": 19,
	"paymentAmount": 39,
	"barCode": "87b9d1f2-6249-4d97-935b-131a73416c94",
	"paymentDate": "2022-04-19T00:00:00.000Z",
	"total": 3538.99,
	"idPaymentMethod": 19
}
```

## License

Nest is [MIT licensed](LICENSE).
