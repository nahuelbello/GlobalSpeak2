"use client";

import { useState, useEffect } from "react";
import {
  TEACHER_SPECIALTIES,
  TEACHER_CERTIFICATIONS,
  LANGUAGE_LIST,
} from "../data/predefinedFields";
import TeacherWeeklyScheduler from "./TeacherWeeklyScheduler";

export default function TeacherSections({
  user,
  userId,
  isOwn,
  specialties = [],
  certifications = [],
  languages = [],
  price,
  nationality = "",
  token,
  stripeStatus,
  stripePayoutReady,
  refreshProfile,
}) {
  // — Estados para edición de campos existentes —
  const [editingSpecs, setEditingSpecs] = useState(false);
  const [draftSpecs, setDraftSpecs] = useState(specialties);

  const [editingCerts, setEditingCerts] = useState(false);
  const [draftCerts, setDraftCerts] = useState(certifications);

  const [editingLangs, setEditingLangs] = useState(false);
  const [draftLangs, setDraftLangs] = useState(languages);

  const [editingPrice, setEditingPrice] = useState(false);
  const [draftPrice, setDraftPrice] = useState(price || "");

  const [editingNat, setEditingNat] = useState(false);
  const [draftNat, setDraftNat] = useState(nationality);

  // — Handler para iniciar OAuth de Stripe Standard —
  const handleOnboard = () => {
    window.location.href = `/api/stripe/oauth/connect?state=${token}`;
  };

  // — Handlers para actualizar cada campo en /api/users/:id/fields —
  const saveSpecs = async () => {
    await fetch(`/api/users/${userId}/fields`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ specialties: draftSpecs }),
    });
    setEditingSpecs(false);
    refreshProfile();
  };

  const saveCerts = async () => {
    await fetch(`/api/users/${userId}/fields`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ certifications: draftCerts }),
    });
    setEditingCerts(false);
    refreshProfile();
  };

  const saveLangs = async () => {
    await fetch(`/api/users/${userId}/fields`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ languages: draftLangs }),
    });
    setEditingLangs(false);
    refreshProfile();
  };

  const savePrice = async () => {
    await fetch(`/api/users/${userId}/fields`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ price: draftPrice }),
    });
    setEditingPrice(false);
    refreshProfile();
  };

  const saveNat = async () => {
    await fetch(`/api/users/${userId}/fields`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nationality: draftNat }),
    });
    setEditingNat(false);
    refreshProfile();
  };

  // — Componente Chip —
  const Chip = ({ children, onRemove }) => (
    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-2 mb-1">
      {children}
      {onRemove && (
        <button className="ml-1 text-red-600 font-bold" onClick={onRemove}>
          ×
        </button>
      )}
    </span>
  );

  // — Render del bloque Stripe según estado —
  const renderStripeBlock = () => {
    if (!isOwn) return null;

    switch (stripeStatus) {
      case "new":
        return (
          <section className="mb-6">
            <div className="max-w-3xl mx-auto p-4 border border-yellow-300 bg-yellow-50 rounded">
              <h3 className="font-semibold text-lg mb-2 text-yellow-800">
                ⏳ Configura tus pagos con Stripe
              </h3>
              <p className="mb-2 text-yellow-700">
                Para que tus alumnos puedan reservar y pagarte, completa el onboarding en Stripe.
              </p>
              <button
                onClick={handleOnboard}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Configurar pagos con Stripe
              </button>
            </div>
          </section>
        );
      case "requirements_incomplete":
        return (
          <section className="mb-6">
            <div className="max-w-3xl mx-auto p-4 border border-orange-300 bg-orange-50 rounded">
              <h3 className="font-semibold text-lg mb-2 text-orange-800">
                ⚠ Información incompleta en Stripe
              </h3>
              <p className="mb-2 text-orange-700">
                Tienes información pendiente en tu cuenta de Stripe. Completa los datos faltantes.
              </p>
              <button
                onClick={handleOnboard}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Completar información
              </button>
            </div>
          </section>
        );
      case "pending_review":
      case "pending":
      case "under_review":
        return (
          <section className="mb-6">
            <div className="max-w-3xl mx-auto p-4 border border-blue-300 bg-blue-50 rounded">
              <h3 className="font-semibold text-lg mb-2 text-blue-800">
                🕐 Cuenta pendiente de revisión
              </h3>
              <p className="mb-2 text-blue-700">
                Ya completaste el onboarding. Tu cuenta está pendiente de revisión por Stripe.
              </p>
            </div>
          </section>
        );
      case "verified":
      case "active":
        return (
          <section className="mb-6">
            <div className="max-w-3xl mx-auto p-4 border border-green-300 bg-green-50 rounded">
              <h3 className="font-semibold text-lg mb-2 text-green-800">
                ✅ Pagos configurados
              </h3>
              <p className="mb-2 text-green-700">
                ¡Tu cuenta de Stripe está verificada! Ya puedes recibir pagos.
              </p>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderStripeBlock()}

      {/* Especialidades */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Especialidades</h2>
        {isOwn && editingSpecs ? (
          <div>
            <div className="flex flex-wrap gap-1 mb-2">
              {draftSpecs.map((esp, idx) => (
                <Chip
                  key={idx}
                  onRemove={() =>
                    setDraftSpecs(draftSpecs.filter((_, i) => i !== idx))
                  }
                >
                  {esp}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {TEACHER_SPECIALTIES.filter(i => !draftSpecs.includes(i)).map((esp, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="px-2 py-1 rounded bg-gray-100 hover:bg-blue-200"
                  onClick={() => setDraftSpecs([...draftSpecs, esp])}
                >
                  + {esp}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Agregar especialidad…"
              className="border p-2 rounded mb-2"
              onKeyDown={e => {
                if (e.key === "Enter" && e.target.value) {
                  setDraftSpecs([...draftSpecs, e.target.value]);
                  e.target.value = "";
                }
              }}
            />
            <div>
              <button onClick={saveSpecs} className="mr-2 bg-blue-600 text-white px-4 py-2 rounded">
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditingSpecs(false);
                  setDraftSpecs(specialties);
                }}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-1 mb-2">
              {specialties.map((esp, i) => (
                <Chip key={i}>{esp}</Chip>
              ))}
            </div>
            {isOwn && (
              <button onClick={() => setEditingSpecs(true)} className="text-blue-600">
                Editar especialidades
              </button>
            )}
          </>
        )}
      </section>

      {/* Certificaciones */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Certificaciones</h2>
        {isOwn && editingCerts ? (
          <div>
            <div className="flex flex-wrap gap-1 mb-2">
              {draftCerts.map((cert, idx) => (
                <Chip
                  key={idx}
                  onRemove={() =>
                    setDraftCerts(draftCerts.filter((_, i) => i !== idx))
                  }
                >
                  {cert}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {TEACHER_CERTIFICATIONS.filter(i => !draftCerts.includes(i)).map((cert, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="px-2 py-1 rounded bg-gray-100 hover:bg-blue-200"
                  onClick={() => setDraftCerts([...draftCerts, cert])}
                >
                  + {cert}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Agregar certificación…"
              className="border p-2 rounded mb-2"
              onKeyDown={e => {
                if (e.key === "Enter" && e.target.value) {
                  setDraftCerts([...draftCerts, e.target.value]);
                  e.target.value = "";
                }
              }}
            />
            <div>
              <button onClick={saveCerts} className="mr-2 bg-blue-600 text-white px-4 py-2 rounded">
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditingCerts(false);
                  setDraftCerts(certifications);
                }}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-1 mb-2">
              {certifications.map((cert, i) => (
                <Chip key={i}>{cert}</Chip>
              ))}
            </div>
            {isOwn && (
              <button onClick={() => setEditingCerts(true)} className="text-blue-600">
                Editar certificaciones
              </button>
            )}
          </>
        )}
      </section>

      {/* Idiomas */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Idiomas</h2>
        {isOwn && editingLangs ? (
          <div>
            <div className="flex flex-wrap gap-1 mb-2">
              {draftLangs.map((lang, idx) => (
                <Chip
                  key={idx}
                  onRemove={() =>
                    setDraftLangs(draftLangs.filter((_, i) => i !== idx))
                  }
                >
                  {lang}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {LANGUAGE_LIST.filter(i => !draftLangs.includes(i)).map((lang, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="px-2 py-1 rounded bg-gray-100 hover:bg-blue-200"
                  onClick={() => setDraftLangs([...draftLangs, lang])}
                >
                  + {lang}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Agregar idioma…"
              className="border p-2 rounded mb-2"
              onKeyDown={e => {
                if (e.key === "Enter" && e.target.value) {
                  setDraftLangs([...draftLangs, e.target.value]);
                  e.target.value = "";
                }
              }}
            />
            <div>
              <button onClick={saveLangs} className="mr-2 bg-blue-600 text-white px-4 py-2 rounded">
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditingLangs(false);
                  setDraftLangs(languages);
                }}
                className="px-4 py-2 rounded border"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-1 mb-2">
              {languages.map((lang, i) => (
                <Chip key={i}>{lang}</Chip>
              ))}
            </div>
            {isOwn && (
              <button onClick={() => setEditingLangs(true)} className="text-blue-600">
                Editar idiomas
              </button>
            )}
          </>
        )}
      </section>

      {/* Tarifa por hora */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Tarifa por hora (USD)</h2>
        {isOwn && editingPrice ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              className="border p-2 rounded"
              value={draftPrice}
              onChange={e => setDraftPrice(e.target.value)}
            />
            <button onClick={savePrice} className="bg-blue-600 text-white px-4 py-2 rounded">
              Guardar
            </button>
            <button
              onClick={() => {
                setEditingPrice(false);
                setDraftPrice(price || "");
              }}
              className="px-4 py-2 rounded border"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <p>
            {price ? `$${price} USD / hora` : "No ha definido tarifa."}
            {isOwn && (
              <button onClick={() => setEditingPrice(true)} className="ml-2 text-blue-600">
                Editar
              </button>
            )}
          </p>
        )}
      </section>

      {/* Disponibilidad semanal */}
      {isOwn && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Disponibilidad semanal</h2>
          <TeacherWeeklyScheduler userId={userId} />
        </section>
      )}
    </>
  );
}