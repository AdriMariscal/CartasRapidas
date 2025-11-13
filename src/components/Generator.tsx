import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
</div >


    <form class="space-y-4" autocomplete="on" onInput={onInput}>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label class="block text-sm font-medium">Nombre</label><input id="nombre" class="w-full rounded-lg border-slate-300" placeholder="Nombre" required /></div>
            <div><label class="block text-sm font-medium">Apellidos</label><input id="apellidos" class="w-full rounded-lg border-slate-300" placeholder="Apellidos" required /></div>
            <div><label class="block text-sm font-medium">DNI/NIE</label><input id="dni" class="w-full rounded-lg border-slate-300" placeholder="12345678A" required /></div>
            <div class="sm:col-span-2"><label class="block text-sm font-medium">Dirección</label><input id="direccion" class="w-full rounded-lg border-slate-300" placeholder="C/ Ejemplo 1, 2ºB" required /></div>
            <div><label class="block text-sm font-medium">CP</label><input id="cp" class="w-full rounded-lg border-slate-300" placeholder="29000" inputmode="numeric" required /></div>
            <div><label class="block text-sm font-medium">Localidad</label><input id="localidad" class="w-full rounded-lg border-slate-300" placeholder="Málaga" required /></div>
            <div><label class="block text-sm font-medium">Provincia</label><input id="provincia" class="w-full rounded-lg border-slate-300" placeholder="Málaga" required /></div>
            <div><label class="block text-sm font-medium">Email</label><input id="email" type="email" class="w-full rounded-lg border-slate-300" placeholder="tu@email.com" /></div>
            <div><label class="block text-sm font-medium">Teléfono</label><input id="telefono" inputmode="tel" class="w-full rounded-lg border-slate-300" placeholder="600 000 000" /></div>
            <div><label class="block text-sm font-medium">Fecha</label><input id="fecha" type="date" class="w-full rounded-lg border-slate-300" required /></div>
            <div><label class="block text-sm font-medium">Nº cliente / contrato</label><input id="nocontrato" class="w-full rounded-lg border-slate-300" placeholder="123456" /></div>
            <div class="sm:col-span-2"><label class="block text-sm font-medium">Destinatario (empresa/entidad)</label><input id="destinatario" class="w-full rounded-lg border-slate-300" placeholder="Nombre de la empresa" required /></div>
            <div class="sm:col-span-2"><label class="block text-sm font-medium">Dirección del destinatario</label><input id="destinatario_direccion" class="w-full rounded-lg border-slate-300" placeholder="C/ Empresa 10, 1ºA, 28000 Madrid" required /></div>
            <div class="sm:col-span-2"><label class="block text-sm font-medium">Detalles adicionales (opcional)</label><textarea id="detalles" rows={3} class="w-full rounded-lg border-slate-300" placeholder="Ej.: Fecha de alta, número de línea, importe del cargo, etc."></textarea></div>
        </div>
        <div class="flex gap-3 pt-2">
            <button type="button" onClick={() => { }} aria-label="Generar carta" class="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Generar</button>
            <button type="button" onClick={clear} aria-label="Limpiar formulario" class="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100">Limpiar</button>
        </div>
        <p class="text-xs text-slate-600">Consejo: usa <span class="font-medium">correo certificado</span> o <span class="font-medium">registro electrónico</span> cuando sea posible.</p>
    </form>
</div >


    {/* Panel Derecho: Previsualización */ }
    < section id = "preview" class="bg-white rounded-2xl shadow-sm border p-4 lg:p-6" >
<div class="flex items-center justify-between mb-3">
<h2 class="text-lg font-semibold">Previsualización</h2>
<div class="flex gap-2">
<button onClick={copy} aria-label="Copiar texto de la carta" class="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-sm">Copiar</button>
<button onClick={pdf} aria-label="Descargar PDF de la carta" class="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm">Descargar PDF</button>
</div>
</div>
<article ref={previewRef as any} id="preview-content" class="prose prose-slate max-w-none text-sm leading-6 whitespace-pre-wrap" aria-live="polite" tabIndex={-1}>{output}</article>
</section >
</section >
);
}


function toast(msg: string) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg; el.setAttribute('style', 'display:block');
    setTimeout(() => el.setAttribute('style', 'display:none'), 1500);
}