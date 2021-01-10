export const dataSetDes = {
  methods: {
    charTypeSet: val => {
      switch (val) {
        case '01':
          return 'DC차데모'
          break;
        case '02':
          return 'AC완속'
          break;
        case '03':
          return 'DC차데모+AC3상'
          break;
        case '04':
          return 'DC콤보'
          break;
        case '05':
          return 'DC차데모+DC콤보'
          break;
        case '06':
          return 'DC차데모+AC3상+DC콤보'
          break;
        case '07':
          return 'AC3상'
          break;
        default:
          return 'err'
          break;
      }
    },
    statSet: val => {
      switch (val) {
        case 1:
          return {
            status: '사용불가',
            reason: '통신이상'
          }
          break;
        case 2:
          return {
            status: '사용가능',
            reason: '충전대기'
          }
          break;
        case 3:
          return {
            status: '사용불가(충전중)',
            reason: '충전중'
          }
          break;
        case 4:
          return {
            status: '사용불가',
            reason: '운영중지'
          }
          break;
        case 5:
          return {
            status: '사용불가',
            reason: '점검중'
          }
          break;
        case 6:
          return {
            status: '사용불가',
            reason: '상태미확인'
          }
          break;
        default:
          return {
            status: 'err',
            reason: 'err'
          }
          break;
      }
    },
    parkingFreeSet: val => {
      switch (val) {
        case 'Y':
          return '무료'
          break;
        case 'N':
          return '유료'
          break;
        default:
          return '현장확인'
          break;
      }
    },
    useTimeSet: val => {
      return (val === '') ? "사용가능시간 확인필요" : val
    }
  },
}