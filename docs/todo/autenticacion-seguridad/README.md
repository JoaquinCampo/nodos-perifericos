# Autenticación & Seguridad · To-Dos

- [x] Seleccionar proveedor de autenticación: utilizar Clerk para gestionar sesiones y credenciales internas multi-tenant.
- [ ] Definir algoritmo y parámetros de hashing (bcrypt vs argon2) y política de rotación de salts. *(Pendiente, revisar requerimiento de hash+salt en letra y decidir)*
- [x] Establecer estrategia de sesiones/tokens: usar sesiones manejadas por Clerk (cookies firmadas) y emitir JWTs solo cuando sea necesario para integraciones externas.
- [x] Diseñar RBAC/ABAC: mantener tabla interna de roles/permisos; evaluar feature de roles de Clerk como alternativa futura.
- [ ] Documentar flujos de alta/baja de usuarios y requisitos de password reset. *(Pendiente, definir más adelante)*
- [ ] Definir lineamientos de auditoría y retención de registros de acceso. *(Pendiente, documentar luego)*
- [ ] Planificar cifrado en reposo de `rndc_auth_secret` y llaves de notificaciones. *(Pendiente, definir solución de cifrado posteriormente)*
- [ ] Evaluar integración con HTTPS mutuo y gestión de certificados. *(Pendiente, definir posteriormente)*
