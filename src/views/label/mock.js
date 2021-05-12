const mockData = {
  labelNums: {
    'code': 200,
    'message': 'OK',
    'description': null,
    'timestamp': '2020-10-14T14:59:51.4731119',
    'data': {
      'total': '234',
      'nodes': [{
        'labelType': '2',
        'labelName': '人',
        'labelNo': 'U002',
        'total': 42,
        'percent': 0.271,
        'children': [{
          'labelName': '事实标签',
          'total': 25
        },
        {
          'labelName': '模型标签',
          'total': 17
        }
        ]
      },
      {
        'labelType': '3',
        'level': '1',
        'labelName': '场',
        'labelNo': 'U003',
        'total': 52,
        'percent': 0.2821,
        'children': [
          {
            'labelName': '行为标签',
            'total': 251
          }
        ]
      },
      {
        'labelType': '4',
        'level': '1',
        'labelName': '时',
        'labelNo': 'U004',
        'total': 52,
        'percent': 0.2821,
        'children': [
          {
            'labelName': '行为标签',
            'total': 252
          },
          {
            'labelName': '事实标签',
            'total': 253
          }
        ]
      },
      {
        'labelType': '5',
        'level': '1',
        'labelName': '活动',
        'labelNo': 'U005',
        'total': 52,
        'percent': 0.2821,
        'children': [
          {
            'labelName': '活动定制标签',
            'total': 25
          }
        ]
      }
      ]
    }
  },
  labelDetail:
    {
      'code': 200,
      'message': 'OK',
      'description': null,
      'timestamp': '2020-10-14T14:59:51.4731119',
      'date': {
        'labelName': '顾客类型',
        'labelAlias': '',
        'labelNo': '',
        'total': 195441,
        'lastTime': '2020-10-12 11:29:28',
        'description': '',
        'nodes': [
          {
            'labelName': '集享会员',
            'labelAlias': '',
            'labelNo': '',
            'total': '144182',
            'percentage': 0.7685
          },
          {
            'labelName': '尊享会员',
            'labelAlias': '',
            'labelNo': '',
            'total': 6348,
            'percentage': 0.1342
          }
        ]
      }
    }
}

export default mockData
