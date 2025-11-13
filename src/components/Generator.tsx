// src/components/Generator.tsx
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
// @ts-ignore - jsPDF vendrá del bundle estándar (añádelo en deps si quieres ESM)
import { jsPDF } from 'jspdf';

type TemplateKey =
    | 'gimnasio_baja'
    | 'desistimiento_14'
    | 'reclamacion_operadora'
    | 'devolucion_cargo'
    | 'asnef_regularizado';

const TEMPLATES: Record<TemplateKey, string> = {
    gimnasio_baja: `**Remitente:** {{nombre}} {{apellidos}} – DNI/NIE {{dni}}
**Dirección:** {{direccion}}, {{cp}}, {{localidad}} ({{provincia}})
{{#telefono}}**Teléfono:** {{telefono}}{{/telefono}}

**Destinatario:** {{destinatario}}
**Asunto:** Solicitud de baja como abonado/a (Nº cliente {{nocontrato}})

{{localidad}}, {{fecha}}

A la atención de {{destinatario}}:

Mediante la presente solicito la **BAJA** como abonado/a del centro a partir del día {{fecha}},
de conformidad con el contrato y respetando el periodo de preaviso de {{preaviso}} días.
Mis datos: nombre y apellidos, DNI/NIE, número de abonado {{nocontrato}} y dirección a efectos de notificaciones.

Ruego confirmen por escrito la fecha de baja y el cese de cargos a partir de la misma.

Sin otro particular, les saludo atentamente.

Firma
{{nombre}} {{apellidos}}`,
    // TODO: Completar con los modelos reales 1:1 para v1
    desistimiento_14: `{{nombre}} {{apellidos}} – DNI {{dni}}\n{{direccion}} — {{cp}} {{localidad}} ({{provincia}})\n\nA la atención de {{destinatario}}\nAsunto: Ejercicio de derecho de desistimiento (14 días) – Contrato {{nocontrato}}\n\n{{localidad}}, {{fecha}}\n\nPor la presente, dentro del plazo legal de 14 días, le comunico mi decisión de desistir del contrato referenciado.\nRuego acuse recibo y proceda a la devolución de las cantidades abonadas, conforme a la normativa aplicable.\n\nAtentamente,\n\n{{nombre}} {{apellidos}}`,
    reclamacion_operadora: `{{nombre}} {{apellidos}} – DNI {{dni}}\n{{direccion}} — {{cp}} {{localidad}} ({{provincia}})\nTel.: {{telefono}}\n\nA la atención de {{destinatario}}\nAsunto: Reclamación por facturación/servicio — Ref. {{nocontrato}}\n\n{{localidad}}, {{fecha}}\n\nExpongo: {{detalles}}.\nSolicito regularización y devolución de importes indebidos, con referencia al contrato indicado.\nQuedo a la espera de respuesta por escrito.\n\n{{nombre}} {{apellidos}}`,
    devolucion_cargo: `{{nombre}} {{apellidos}} – DNI {{dni}}\n{{direccion}} — {{cp}} {{localidad}} ({{provincia}})\n\nA la atención de {{destinatario}}\nAsunto: Requerimiento de devolución de cargo bancario SEPA — Ref. {{nocontrato}}\n\n{{localidad}}, {{fecha}}\n\nSolicito la retrocesión del cargo indicado al amparo de la normativa SEPA, por no estar autorizado/ser erróneo.\nAdjunto justificantes.\n\n{{nombre}} {{apellidos}}`,
    asnef_regularizado: `{{nombre}} {{apellidos}} – DNI {{dni}}\n{{direccion}} — {{cp}} {{localidad}} ({{provincia}})\n\nA la atención de {{destinatario}}\nAsunto: Reclamación de datos en ASNEF por deuda regularizada\n\n{{localidad}}, {{fecha}}\n\nSolicito la cancelación/rectificación de mis datos en ASNEF, por encontrarse la situación regularizada.\nAdjunto justificantes de pago.\n\n{{nombre}} {{apellidos}}`,
};

// Reemplazo naive de {{placeholders}} y secciones opcionales {{#campo}} ... {{/campo}}
function renderTemplate(tpl: string, data: Record<string, string>) {
    // secciones opcionales
    tpl = tpl.replace(
        /\{\{#(\w+)}}([\s\S]*?)\{\{\/(\w+)}}/g,
        (_, key, inner) =>
            data[key]
                ? inner.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), data[key])
                : ''
    );
    // placeholders simples
    return tpl.replace(/\{\{(\w+)}}/g, (_, key) => data[key] ?? '');
}

export default function Generator() {
    const [template, setTemplate] = useState<TemplateKey>('gimnasio_baja');
    const [form, setForm] = useState<Record<string, string>>({
        nombre: '',
        apellidos: '',
        dni: '',
        direccion: '',
        cp: '',
        localidad: '',
        provincia: '',
        email: '',
        telefono: '',
        fecha: '',
        nocontrato: '',
        destinatario: '',
        destinatario_direccion: '',
        detalles: '',
        preaviso: '30',
    });
    const previewRef = useRef<HTMLDivElement>(null);

    const output = useMemo(
        () => renderTemplate(TEMPLATES[template], form),
        [template, form]
    );

    const onInput = (e: any) => {
        const t = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        setForm((s) => ({ ...s, [t.id]: t.value }));
    };

    const copy = async () => {
        await navigator.clipboard.writeText(output);
        toast('Texto copiado');
    };

    const pdf = async () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const lines = doc.splitTextToSize(output, 520);
        doc.setFont('Times', 'Normal');
        doc.setFontSize(12);
        let y = 72;
        lines.forEach((ln: string) => {
            doc.text(ln, 48, y);
            y += 16;
        });
        doc.save('carta.pdf');
    };

    const clear = () =>
        setForm({
            nombre: '',
            apellidos: '',
            dni: '',
            direccion: '',
            cp: '',
            localidad: '',
            provincia: '',
            email: '',
            telefono: '',
            fecha: '',
            nocontrato: '',
            destinatario: '',
            destinatario_direccion: '',
            detalles: '',
            preaviso: '30',
        });

    useEffect(() => {
        previewRef.current?.focus();
    }, [output]);

    return (
        <section id="plantillas" class="grid lg:grid-cols-2 gap-8">
            {/* Panel Izquierdo */}
            <div>
                <div class="mb-5">
                    <label
                        for="template"
                        class="block text-sm font-medium text-slate-700 mb-1"
                    >
                        Tipo de carta
                    </label>
                    <select
                        id="template"
                        class="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-emerald-500"
                        value={template}
                        onInput={onInput}
                    >
                        <option value="gimnasio_baja">Baja de gimnasio</option>
                        <option value="desistimiento_14">Desistimiento 14 días</option>
                        <option value="reclamacion_operadora">Reclamación a operadora</option>
                        <option value="devolucion_cargo">
                            Requerimiento devolución de cargo bancario
                        </option>
                        <option value="asnef_regularizado">
                            Reclamación ASNEF (situación regularizada)
                        </option>
                    </select>
                </div>

                <form class="space-y-4" autocomplete="on" onInput={onInput}>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium">Nombre</label>
                            <input
                                id="nombre"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="Nombre"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Apellidos</label>
                            <input
                                id="apellidos"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="Apellidos"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">DNI/NIE</label>
                            <input
                                id="dni"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="12345678A"
                                required
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-medium">Dirección</label>
                            <input
                                id="direccion"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="C/ Ejemplo 1, 2ºB"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">CP</label>
                            <input
                                id="cp"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="29000"
                                inputMode="numeric"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Localidad</label>
                            <input
                                id="localidad"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="Málaga"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Provincia</label>
                            <input
                                id="provincia"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="Málaga"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Email</label>
                            <input
                                id="email"
                                type="email"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="tu@email.com"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Teléfono</label>
                            <input
                                id="telefono"
                                inputMode="tel"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="600 000 000"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Fecha</label>
                            <input
                                id="fecha"
                                type="date"
                                class="w-full rounded-lg border-slate-300"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">
                                Nº cliente / contrato
                            </label>
                            <input
                                id="nocontrato"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="123456"
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-medium">
                                Destinatario (empresa/entidad)
                            </label>
                            <input
                                id="destinatario"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="Nombre de la empresa"
                                required
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-medium">
                                Dirección del destinatario
                            </label>
                            <input
                                id="destinatario_direccion"
                                class="w-full rounded-lg border-slate-300"
                                placeholder="C/ Empresa 10, 1ºA, 28000 Madrid"
                                required
                            />
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-medium">
                                Detalles adicionales (opcional)
                            </label>
                            <textarea
                                id="detalles"
                                rows={3}
                                class="w-full rounded-lg border-slate-300"
                                placeholder="Ej.: Fecha de alta, número de línea, importe del cargo, etc."
                            />
                        </div>
                    </div>
                    <div class="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => { }}
                            aria-label="Generar carta"
                            class="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            Generar
                        </button>
                        <button
                            type="button"
                            onClick={clear}
                            aria-label="Limpiar formulario"
                            class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
                        >
                            Limpiar
                        </button>
                    </div>
                    <p class="text-xs text-slate-600">
                        Consejo: usa <span class="font-medium">correo certificado</span> o{' '}
                        <span class="font-medium">registro electrónico</span> cuando sea posible.
                    </p>
                </form>
            </div>

            {/* Panel Derecho: Previsualización */}
            <section id="preview" class="bg-white rounded-2xl shadow-sm border p-4 lg:p-6">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="text-lg font-semibold">Previsualización</h2>
                    <div class="flex gap-2">
                        <button
                            onClick={copy}
                            aria-label="Copiar texto de la carta"
                            class="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-sm"
                        >
                            Copiar
                        </button>
                        <button
                            onClick={pdf}
                            aria-label="Descargar PDF de la carta"
                            class="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
                        >
                            Descargar PDF
                        </button>
                    </div>
                </div>
                <article
                    ref={previewRef as any}
                    id="preview-content"
                    class="prose prose-slate max-w-none text-sm leading-6 whitespace-pre-wrap"
                    aria-live="polite"
                    tabIndex={-1}
                >
                    {output}
                </article>
            </section>
        </section>
    );
}

function toast(msg: string) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.setAttribute('style', 'display:block');
    setTimeout(() => el.setAttribute('style', 'display:none'), 1500);
}
