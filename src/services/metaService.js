import api from '../ApiConfig';

class MetaService {

  getMetaInfo = () => {
    return new Promise((resolve, reject) => {
      api.get('/admin/setting/meta-info').then(res => {
        if (res.data.success === true) {
          resolve(res.data.doc);
        }
        else {
          reject(res.data.message);
        }
      });
    });
  };

}

const metaService = new MetaService();

export default metaService;