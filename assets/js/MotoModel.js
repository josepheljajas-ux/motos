class MotoModel {
  constructor(motos) {
    this.motos = motos;
    this.state = {
      condicion: new Set(),
      tipo: new Set(),
      marca: new Set(),
      kilometraje: new Set(),
      anio: new Set(),
      transmision: new Set(),
      combustible: new Set(),
      cilindraje: new Set(),
      precioMax: 40000000,
      orden: "relevancia",
      query: ""
    };
    
    this.cilRangos = [
      { label: "Menores a 149cc", test: c => c < 149 },
      { label: "150cc y 199cc", test: c => c >= 150 && c <= 199 },
      { label: "200cc y 299cc", test: c => c >= 200 && c <= 299 },
      { label: "Mayores a 300cc", test: c => c >= 300 }
    ];

    this.kmRangos = [
      { label: "Hasta 25.000", test: k => k <= 25000 },
      { label: "Hasta 30.000", test: k => k <= 30000 },
      { label: "Hasta 50.000", test: k => k <= 50000 },
      { label: "Hasta 100.000", test: k => k <= 100000 }
    ];

    this.anioRangos = [
      { label: "2020 - 2026", test: y => y >= 2020 && y <= 2027 }, // includes 2027
      { label: "2010 - 2019", test: y => y >= 2010 && y <= 2019 },
      { label: "2000 - 2009", test: y => y >= 2000 && y <= 2009 }
    ];
  }

  getMotos() {
    return this.motos;
  }

  getFiltered() {
    let list = this.motos.filter(m => {
      // Basic direct set match filters
      if (this.state.condicion.size && !this.state.condicion.has(m.condicion)) return false;
      if (this.state.tipo.size && !this.state.tipo.has(m.tipo)) return false;
      if (this.state.marca.size && !this.state.marca.has(m.marca)) return false;
      if (this.state.transmision.size && !this.state.transmision.has(m.transmision)) return false;
      if (this.state.combustible.size && !this.state.combustible.has(m.combustible)) return false;

      // Range filters
      if (this.state.cilindraje.size) {
        const matches = [...this.state.cilindraje].some(label => {
          const rango = this.cilRangos.find(r => r.label === label);
          return rango ? rango.test(m.cilindraje) : false;
        });
        if (!matches) return false;
      }

      if (this.state.kilometraje.size) {
        const matches = [...this.state.kilometraje].some(label => {
          const rango = this.kmRangos.find(r => r.label === label);
          return rango ? rango.test(m.km) : false;
        });
        if (!matches) return false;
      }

      if (this.state.anio.size) {
        const matches = [...this.state.anio].some(label => {
          const rango = this.anioRangos.find(r => r.label === label);
          return rango ? rango.test(m.anio) : false;
        });
        if (!matches) return false;
      }

      // Price limit
      if (m.precio > this.state.precioMax) return false;

      // Search query
      if (this.state.query) {
        const q = this.state.query.toLowerCase();
        const haystack = `${m.marca} ${m.modelo} ${m.referencia} ${m.tipo}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    // Sorting
    switch (this.state.orden) {
      case "precio-asc":  list.sort((a, b) => a.precio - b.precio); break;
      case "precio-desc": list.sort((a, b) => b.precio - a.precio); break;
      case "anio-desc":   list.sort((a, b) => b.anio - a.anio); break;
      case "anio-asc":    list.sort((a, b) => a.anio - b.anio); break;
      case "km-desc":     list.sort((a, b) => b.km - a.km); break;
      case "km-asc":      list.sort((a, b) => a.km - b.km); break;
    }
    return list;
  }

  toggleFilter(type, value) {
    const set = this.state[type];
    if (!set) return false;
    if (set.has(value)) {
      set.delete(value);
      return false; // Inactive
    } else {
      set.add(value);
      return true; // Active
    }
  }

  addFilter(type, value) {
    const set = this.state[type];
    if (!set) return false;
    set.add(value);
    return true;
  }

  setPrecioMax(value) {
    this.state.precioMax = value;
  }

  setOrden(value) {
    this.state.orden = value;
  }

  setQuery(value) {
    this.state.query = value;
  }

  reset() {
    this.state.condicion.clear();
    this.state.tipo.clear();
    this.state.marca.clear();
    this.state.kilometraje.clear();
    this.state.anio.clear();
    this.state.transmision.clear();
    this.state.combustible.clear();
    this.state.cilindraje.clear();
    this.state.precioMax = 40000000;
    this.state.orden = "relevancia";
    this.state.query = "";
  }
}
