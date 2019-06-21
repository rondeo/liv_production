export class Device {
    label: string;
    value: string;
    events: Array<{
        key: string,
        value: string
    }>;
}

export var devices: Device[] = [
    {
        label: 'Fridge',
        value: 'Fridge',
        events: [
            {
                key: 'Temperature',
                value: 'temperature'
            },
            {
                key: 'Order Milk',
                value: 'milkorder'
            },
            {
                key: 'Service the Fridge',
                value: 'fridgeservice'
            }
        ]
    },
    {
        label: 'Coffee Maker',
        value: 'Coffee_Maker',
        events: [{
            key: 'Order Bean',
            value: 'beanorder'
        }]
    },
    {
        label: 'Air Conditioner',
        value: 'Air_Conditioner',
        events: [{
            key: 'No one in the room',
            value: 'noone_room'
        }]
    },
    {
        label: 'Washer',
        value: 'Washer',
        events: [{
            key: 'Change Water',
            value: 'changewater'
        }]
    },
    {
        label: 'Oven',
        value: 'Oven',
        events: [{
            key: 'Order Pizza',
            value: 'orderpizza'
        }]
    }
];

export var senders = [
    {
        id: '6586712601',
        value: '+6586712601'
    },
    {
        id: '971552574298',
        value: '+971552574298'
    },
    {
        id: '919845073823',
        value: '+919845073823'
    },
    {
        id: '919995669111',
        value: '+919995669111'
    },
    {
        id: '1322260777842026',
        value: 'FB Messenger'
    },
    {
        id: '919496347047',
        value: '+919496347047'
    },
    {
        id: '919497757070',
        value: '+919497757070'
    }, 
    {
        id: '918547276956',
        value: '+918547276956'
    }
];