const METHODS = {
	GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

/**
	* Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
	* На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
	* На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
*/
function queryStringify(data) {
	// Можно делать трансформацию GET-параметров в отдельной функции
  let result = "";
  let symb = "?";
  Object.entries(data).forEach(([key, value]) => {
    
    result += `${symb}${key}=${value
  }`;
    symb = "&";
  });
  return result;
}


class HTTPTransport {
		get = (url, options = {}) => {
          
			return this.request(url, {...options, method: METHODS.GET});
		};
         
        put = (url, options = {}) => {
          
          return this.request(url, {...options, method: METHODS.PUT});
        };

        post = (url, options = {}) => {
          
          return this.request(url, {...options, method: METHODS.POST});
        };
  
        delete = (url, options = {}) => {
          
          return this.request(url, {...options, method: METHODS.DELETE});
        };
  
		// PUT, POST, DELETE
		// options:
		// headers — obj
		// data — obj
       
		_request = (url, options) => {
		  let data = options.data;
          const headers = options.headers;
          const method = options.method || METHODS.GET;
          const timeout = options.timeout || 5000;
          
          return new Promise((resolve,reject) => {
            
            const xhr = new XMLHttpRequest();
            let withData = !!data;
            
            if (METHODS.GET === method) {
              if (withData) {
                url += queryStringify(data);
                withData = false;
              }
            }
            
            xhr.open(method, url);
            if (headers) xhr.setRequestHeader(headers);
            xhr.timeout = timeout;
            
            xhr.onloadend = () => resolve(xhr);
            xhr.ontimeout = reject;
            xhr.onerror = reject;
            xhr.onabort = reject;
            
            if (withData) xhr.send(data);
            else xhr.send();
          })
		};
  
        _requestReq = async (retryNumber, retries = 1,  ...args) => {
          let result;
          
          try {
            result = await this._request(...args);
          }
          catch(exp) {
            retryNumber++;
            if (retryNumber > retries) throw new Error("Не удалось загрузить. " + exp);
            result = await this._requestReq(retryNumber, retries, ...args);
          }
 
          return result;
        }

        request = (url, options) => {
          return this._requestReq(0, options.retries, url, options);
        }
}

function fetchWithRetry(url, options) {
	const transport = new HTTPTransport();
    return transport.request(url, options);
}

