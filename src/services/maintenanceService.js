import api from '../ApiConfig';

class MaintenanceService {

  getMaintenanceStatus = () => {
    return new Promise((resolve, reject) => {
      api.get('/admin/setting/maintenance').then(res => {
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

const maintenanceService = new MaintenanceService();

export default maintenanceService;