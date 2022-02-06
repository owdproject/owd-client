import {OwdCoreContext} from "@owd-client/types";

export default class CoreModule implements OwdCoreContext {
    private readonly context: OwdCoreContext

    protected constructor(ctx: OwdCoreContext) {
        this.context = ctx
    }

    get app() {
        return this.context.app
    }

    get config() {
        return this.context.config
    }

    get extensions() {
        return this.context.extensions
    }

    get theme() {
        return this.context.extensions.theme
    }

    get store() {
        return this.context.store
    }

    get router() {
        return this.context.router
    }

    get modules() {
        return this.context.modules
    }

    get plugins() {
        return this.context.plugins
    }

    get terminal() {
        return this.context.terminal
    }

    get assets() {
        return this.context.assets
    }

    get i18n() {
        return this.context.i18n
    }
}