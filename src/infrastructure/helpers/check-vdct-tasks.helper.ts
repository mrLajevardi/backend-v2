function checkVdcTask(session, filter, taskType, interval, taskName) {
  return new Promise(async (resolve, reject) => {
    const checkInterval = setInterval(checkIntervalFun, interval);
    async function checkIntervalFun() {
      try {
        const task = await mainWrapper.user.vdc.vcloudQuery(session, {
          type: taskType,
          page: 1,
          pageSize: 30,
          sortDesc: 'startDate',
          filter,
        });
        if (task.data.record[0].status === 'error') {
          clearInterval(checkInterval);
          reject(new Error(`vdc task [${taskName}] failed`));
        } else if (task.data.record[0].status === 'success') {
          clearInterval(checkInterval);
          resolve(task);
        }
      } catch (err) {
        clearInterval(checkInterval);
        reject(err);
      }
    }
    await checkIntervalFun();
  });
}
