import React, { useEffect, useRef, useState } from "react";
import useStore from "@store/store";
import { useTranslation } from "react-i18next";
import PopupModal from "@components/PopupModal";
import { ConfigInterface, ModelOptions } from "@type/chat";
import DownChevronArrow from "@icon/DownChevronArrow";
import { modelMaxToken, modelOptions } from "@constants/chat";
import useHideOnOutsideClick from "@hooks/useHideOnOutsideClick";

const ConfigMenu = ({
  setIsModalOpen,
  config,
  setConfig,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  config: ConfigInterface;
  setConfig: (config: ConfigInterface) => void;
}) => {
  const [_maxToken, _setMaxToken] = useState<number>(config.max_tokens);
  const [_maxContext, _setMaxContext] = useState<number>(config.max_context);
  const [_model, _setModel] = useState<ModelOptions>(config.model);
  const [_temperature, _setTemperature] = useState<number>(config.temperature);
  const [_presencePenalty, _setPresencePenalty] = useState<number>(
    config.presence_penalty,
  );
  const [_topP, _setTopP] = useState<number>(config.top_p);
  const [_frequencyPenalty, _setFrequencyPenalty] = useState<number>(
    config.frequency_penalty,
  );
  const { t } = useTranslation("model");

  const handleConfirm = () => {
    setConfig({
      max_tokens: _maxToken,
      max_context: _maxContext,
      model: _model,
      temperature: _temperature,
      presence_penalty: _presencePenalty,
      top_p: _topP,
      frequency_penalty: _frequencyPenalty,
    });
    setIsModalOpen(false);
  };

  return (
    <PopupModal
      title={t("configuration") as string}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleConfirm}
      handleClickBackdrop={handleConfirm}
    >
      <div className="p-6 border-b bg-neutral-base">
        <label className="block text-sm font-medium text-custom-white pb-2">
          {t("model")}:
        </label>
        <ModelSelector _model={_model} _setModel={_setModel} />
        <MaxTokenSlider
          _maxToken={_maxToken}
          _setMaxToken={_setMaxToken}
          _model={_model}
        />
        <MaxContextSlider
          _maxContext={_maxContext}
          _setMaxContext={_setMaxContext}
          _model={_model}
        />
        <TemperatureSlider
          _temperature={_temperature}
          _setTemperature={_setTemperature}
        />
        <TopPSlider _topP={_topP} _setTopP={_setTopP} />
        <PresencePenaltySlider
          _presencePenalty={_presencePenalty}
          _setPresencePenalty={_setPresencePenalty}
        />
        <FrequencyPenaltySlider
          _frequencyPenalty={_frequencyPenalty}
          _setFrequencyPenalty={_setFrequencyPenalty}
        />
      </div>
    </PopupModal>
  );
};

export const ModelSelector = ({
  _model,
  _setModel,
}: {
  _model: ModelOptions;
  _setModel: React.Dispatch<React.SetStateAction<ModelOptions>>;
}) => {
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

  return (
    <div className="mb-4">
      <button
        className="btn btn-neutral btn-small flex gap-1 p-1.5 rounded-md"
        type="button"
        onClick={() => setDropDown((prev) => !prev)}
        aria-label="model"
      >
        {_model}
        <DownChevronArrow />
      </button>
      <div
        id="dropdown"
        ref={dropDownRef}
        className={`${
          dropDown ? "" : "hidden"
        } absolute top-100 bottom-100 z-10 bg-neutral-light shadow-xl rounded-lg border border-neutral-base group w-36`}
      >
        <ul
          className="text-sm p-0 m-0 max-h-72 overflow-auto"
          aria-labelledby="dropdownDefaultButton"
        >
          {modelOptions.map((m) => (
            <li
              className="px-4 py-2 hover:bg-neutral-dark cursor-pointer text-custom-white"
              onClick={() => {
                _setModel(m);
                setDropDown(false);
              }}
              key={m}
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const MaxTokenSlider = ({
  _maxToken,
  _setMaxToken,
  _model,
}: {
  _maxToken: number;
  _setMaxToken: React.Dispatch<React.SetStateAction<number>>;
  _model: ModelOptions;
}) => {
  const { t } = useTranslation("model");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef &&
      inputRef.current &&
      _setMaxToken(Number(inputRef.current.value));
  }, [_model]);

  return (
    <div>
      <label className="block text-sm font-medium text-custom-white">
        {t("token.label")}: {_maxToken}
      </label>
      <input
        type="range"
        ref={inputRef}
        value={_maxToken}
        onChange={(e) => {
          _setMaxToken(Number(e.target.value));
        }}
        min={0}
        max={modelMaxToken[_model]}
        step={1}
        className="w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer"
      />
      <div className="min-w-fit text-custom-white text-sm mt-2">
        {t("token.description")}
      </div>
    </div>
  );
};

export const MaxContextSlider = ({
  _maxContext,
  _setMaxContext,
  _model,
}: {
  _maxContext: number;
  _setMaxContext: React.Dispatch<React.SetStateAction<number>>;
  _model: ModelOptions;
}) => {
  const { t } = useTranslation("model");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef &&
      inputRef.current &&
      _setMaxContext(Number(inputRef.current.value));
  }, [_model]);

  return (
    <div className="mt-5 pt-5 border-t border-neutral-base">
      <label className="block text-sm font-medium text-custom-white">
        {t("context.label")}: {_maxContext}
      </label>
      <input
        type="range"
        ref={inputRef}
        value={_maxContext}
        onChange={(e) => {
          _setMaxContext(Number(e.target.value));
        }}
        min={0}
        max={modelMaxToken[_model]}
        step={1}
        className="w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer"
      />
      <div className="min-w-fit text-custom-white text-sm mt-2">
        {t("context.description")}
      </div>
    </div>
  );
};

export const TemperatureSlider = ({
  _temperature,
  _setTemperature,
}: {
  _temperature: number;
  _setTemperature: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation("model");

  return (
    <div className="mt-5 pt-5 border-t border-neutral-base">
      <label className="block text-sm font-medium text-custom-white">
        {t("temperature.label")}: {_temperature}
      </label>
      <input
        id="default-range"
        type="range"
        value={_temperature}
        onChange={(e) => {
          _setTemperature(Number(e.target.value));
        }}
        min={0}
        max={2}
        step={0.1}
        className="w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer"
      />
      <div className="min-w-fit text-custom-white text-sm mt-2">
        {t("temperature.description")}
      </div>
    </div>
  );
};

export const TopPSlider = ({
  _topP,
  _setTopP,
}: {
  _topP: number;
  _setTopP: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation("model");

  return (
    <div className="mt-5 pt-5 border-t border-neutral-base">
      <label className="block text-sm font-medium text-custom-white">
        {t("topP.label")}: {_topP}
      </label>
      <input
        id="default-range"
        type="range"
        value={_topP}
        onChange={(e) => {
          _setTopP(Number(e.target.value));
        }}
        min={0}
        max={1}
        step={0.05}
        className="w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer"
      />
      <div className="min-w-fit text-custom-white text-sm mt-2">
        {t("topP.description")}
      </div>
    </div>
  );
};

export const PresencePenaltySlider = ({
  _presencePenalty,
  _setPresencePenalty,
}: {
  _presencePenalty: number;
  _setPresencePenalty: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation("model");

  return (
    <div className="mt-5 pt-5 border-t border-neutral-base">
      <label className="block text-sm font-medium text-custom-white">
        {t("presencePenalty.label")}: {_presencePenalty}
      </label>
      <input
        id="default-range"
        type="range"
        value={_presencePenalty}
        onChange={(e) => {
          _setPresencePenalty(Number(e.target.value));
        }}
        min={-2}
        max={2}
        step={0.1}
        className="w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer"
      />
      <div className="min-w-fit text-custom-white text-sm mt-2">
        {t("presencePenalty.description")}
      </div>
    </div>
  );
};

export const FrequencyPenaltySlider = ({
  _frequencyPenalty,
  _setFrequencyPenalty,
}: {
  _frequencyPenalty: number;
  _setFrequencyPenalty: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation("model");

  return (
    <div className="mt-5 pt-5 border-t border-neutral-base">
      <label className="block text-sm font-medium text-custom-white">
        {t("frequencyPenalty.label")}: {_frequencyPenalty}
      </label>
      <input
        id="default-range"
        type="range"
        value={_frequencyPenalty}
        onChange={(e) => {
          _setFrequencyPenalty(Number(e.target.value));
        }}
        min={-2}
        max={2}
        step={0.1}
        className="w-full h-2 bg-neutral-light rounded-lg appearance-none cursor-pointer"
      />
      <div className="min-w-fit text-custom-white text-sm mt-2">
        {t("frequencyPenalty.description")}
      </div>
    </div>
  );
};

export default ConfigMenu;
