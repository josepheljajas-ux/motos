class MotoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Bind event handlers
    this.view.bindPrecioChange(val => {
      this.model.setPrecioMax(val);
      this.render();
    });

    this.view.bindOrdenChange(val => {
      this.model.setOrden(val);
      this.render();
    });

    this.view.bindSearchInput(val => {
      this.model.setQuery(val);
      this.render();
    });

    this.view.bindResetClick(() => {
      this.model.reset();
      window.history.replaceState(null, "", window.location.pathname);
      this.render();
    });
  }

  init() {
    this.view.buildTicks();

    this.view.buildFilters(
      this.model.getMotos(),
      (type, value, isChecked) => this.handleCheckboxChange(type, value, isChecked)
    );

    this.applyInitialParams();
    this.render();
  }

  applyInitialParams() {
    const params = new URLSearchParams(window.location.search);
    const filterTypes = ["condicion", "tipo", "marca", "transmision", "combustible"];

    filterTypes.forEach(type => {
      const values = params.getAll(type).flatMap(value => value.split(","));

      values.forEach(rawValue => {
        const value = this.normalizeInitialFilterValue(type, rawValue.trim());
        if (!value) return;

        const hasCheckbox = this.view.setCheckboxValue(type, value, true);
        if (!hasCheckbox) return;

        this.model.addFilter(type, value);
        this.view.openFilterGroup(type);
      });
    });

    const query = params.get("q");
    if (query) {
      this.model.setQuery(query);
      this.view.setSearchValue(query);
    }

    const precioMax = Number(params.get("precioMax"));
    if (Number.isFinite(precioMax) && precioMax > 0) {
      this.model.setPrecioMax(precioMax);
      this.view.setPrecioValue(precioMax);
    }

    const orden = params.get("orden");
    if (orden) {
      this.model.setOrden(orden);
      this.view.setOrdenValue(orden);
    }
  }

  normalizeInitialFilterValue(type, value) {
    if (type === "tipo" && value === "trail") return "touring";
    return value;
  }

  handleCheckboxChange(type, value, isChecked) {
    this.model.toggleFilter(type, value);
    this.render();
  }

  render() {
    const filtered = this.model.getFiltered();
    const totalCount = this.model.getMotos().length;
    const allMotos = this.model.getMotos();

    this.view.render(filtered, totalCount, allMotos);
  }
}