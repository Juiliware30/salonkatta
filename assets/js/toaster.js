function Toast(options={}) {
	const defaults = {
		type: ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'dark'],
	};
	this.parent = options?.parent ?? document.body;
	this.title = options?.title ?? 'Toast title';
	this.body = options?.body ?? 'Toast message';
	this.type = (options?.type &&  defaults.type.includes(options.type)) ? options.type : 'default';
	this.icon = options?.icon ?? null;
	this.autohide = options?.autohide ?? true;
	this.animation = options?.animation ?? true;
	this.delay = options?.delay ?? 5000;
	this.toast = null;
	const config = {};
	config.autohide = this.autohide;
	config.animation = this.animation;
	config.delay = this.delay;
	const container = document.createElement('div');
	container.innerHTML = `<div class="toast fade text-bg-${this.type}" role="alert">
			<div class="toast-header">
				${this.icon ? `<img src="${this.icon}" width="25" height="25">` : ''}
				<strong class="${this.icon ? 'ms-2' : ''} me-auto">${this.title}</strong>
				<button class="btn-close" data-bs-dismiss="toast"></button>
			</div>
			<div class="toast-body">${this.body}</div>
		</div>`;
	const toast = container.querySelector('.toast');
	this.parent.prepend(toast);
	toast.addEventListener('hidden.bs.toast', () => {
		toast.remove();
	});
	if ('object' === typeof bootstrap) {
		this.toast = new bootstrap.Toast(toast, config);
		this.toast.show();
	} else {
		throw new Error('Bootstrap required to show toast messages');
	}
}