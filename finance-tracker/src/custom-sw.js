// self.addEventListener("push", function (event) {
//   const data = event.data.json();
//   console.log("dane" + data);

//   const options = {
//     body: data.body,
//     icon: data.icon || "/assets/icons/icon-96x96.png",
//     vibrate: data.vibrate || [100, 50, 100],
//     data: data.url || "/",
//   };

//   event.waitUntil(self.registration.showNotification(data.title, options));
// });

// self.addEventListener("notificationclick", function (event) {
//   event.notification.close();
//   event.waitUntil(clients.openWindow(event.notification.data));
// });
