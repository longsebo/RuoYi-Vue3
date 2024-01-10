import { ComponentPublicInstance, defineComponent, getCurrentInstance, onMounted, reactive, watch } from 'vue'
// @ts-ignore
// eslint-disable-next-line import/extensions
import JsonEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';
import './style.css';
// eslint-disable-next-line import/prefer-default-export
export const Vue3JsonEditor = defineComponent({
    props: {
        modelValue: [String, Boolean, Object, Array],
        showBtns: [Boolean],
        expandedOnStart: {
            type: Boolean,
            default: false
        },
        navigationBar: {
            type: Boolean,
            default: true
        },
        mode: {
            type: String,
            default: 'tree'
        },
        modes: {
            type: Array,
            default () {
                return ['tree', 'code', 'form', 'text', 'view']
            }
        },
        lang: {
            type: String,
            default: 'en'
        },
        onNodeName: {
            type: Function,
            default: ()=>{}
        }
    },
    setup (props: any, { emit }) {
        const root = getCurrentInstance()?.root.proxy as ComponentPublicInstance

        const state = reactive({
            editor: null as any,
            error: false,
            json: {},
            internalChange: false,
            expandedModes: ['tree', 'view', 'form'],

            uid: `jsoneditor-vue-${getCurrentInstance()?.uid}`
        })

        watch(
            () => props.modelValue as unknown as any,
            async (val) => {
                if (!state.internalChange) {
                    state.json = val
                    // eslint-disable-next-line no-use-before-define
                    await setEditor(val)
                    state.error = false
                    // eslint-disable-next-line no-use-before-define
                    expandAll()
                }
            }, { immediate: true })

        onMounted(() => {
            //这个options的定义是完全参考jsoneditor的api文档的
            const options = {
                mode: props.mode,
                modes: props.modes,
                onChange () {
                    try {
                        //debugger;
                        const json = state.editor.get()
                        state.json = json
                        state.error = false
                        // eslint-disable-next-line vue/custom-event-name-casing
                        emit('json-change', json)
                        state.internalChange = true
                        emit('input', json)
                        root.$nextTick(function () {
                            state.internalChange = false
                        })
                    } catch (e) {
                        state.error = true
                        // eslint-disable-next-line vue/custom-event-name-casing
                        emit('has-error', e)
                    }
                },
                onNodeName(v: object) {
                    // eslint-disable-next-line vue/custom-event-name-casing
                    return props.onNodeName(v);
                },

                onModeChange () {
                    // eslint-disable-next-line no-use-before-define
                    expandAll()
                },
                navigationBar: props.navigationBar
            }
            state.editor = new JsonEditor(
                document.querySelector(`#${state.uid}`),
                options,
                state.json
            )

            // eslint-disable-next-line vue/custom-event-name-casing
            emit('provide-editor', state.editor)
        })

        function expandAll () {
            if (props.expandedOnStart && state.expandedModes.includes(props.mode)) {
                (state.editor as any).expandAll()
            }
        }

        function onSave () {
            // eslint-disable-next-line vue/custom-event-name-casing
            emit('json-save', state.json)
        }

        function setEditor (value: any): void {
            if (state.editor) state.editor.set(value)
        }

        return () => {
            // @ts-ignore
            // @ts-ignore
            return (
                <div class={'jsoneditor-vue'} >
                    <div id={state.uid} class={'jsoneditor-vue'} ></div>
                </div>
            )
        }
    }
})

