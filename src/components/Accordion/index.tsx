import React, { useEffect, useRef, useState } from 'react';
import { useAccordionContext } from '../../context/accordionContext';
import { createAccordionData, createCelebrityData } from '../../utils/createAccordionData';
import { deleteCelebFromLocal, updateCelebLocal } from '../../utils/localStorage';
import { AccordionData, CelebrityInfo } from '../../types';
import './index.css';

interface AccordionProps {
  celebrityInfo: CelebrityInfo;
  reloadLocal: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ celebrityInfo, reloadLocal }) => {
  const { expandedAccordionId, setExpandedAccordionId, isBeingEdited, setIsBeingEdited } = useAccordionContext();

  const accordionDataRef = useRef<AccordionData | null>(null);
  const accordionRef = useRef<HTMLElement | null>(null);
  const accordionTogglerRef = useRef<HTMLSpanElement | null>(null);

  const accordionNameRef = useRef<HTMLHeadingElement | null>(null);
  const accordionAgeRef = useRef<HTMLInputElement | null>(null);
  const accordionGenderRef = useRef<HTMLSelectElement | null>(null);
  const accordionCountryRef = useRef<HTMLInputElement | null>(null);
  const accordionDescriptionRef = useRef<HTMLParagraphElement | null>(null);

  const deleteCelebDialogBgRef = useRef<HTMLDivElement | null>(null);
  const deleteCelebDialogRef = useRef<HTMLSpanElement | null>(null);

  const [accordionName, setAccordionName] = useState<string | null>(null);
  const [accordionAge, setAccordionAge] = useState<number | null>(null);
  const [accordionGender, setAccordionGender] = useState<AccordionData['gender'] | null>(null);
  const [accordionCountry, setAccordionCountry] = useState<string | null>(null);
  const [accordionDescription, setAccordionDescription] = useState<string | null>(null);
  const [accordionIsAdult, setAccordionIsAdult] = useState<boolean>(true);

  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [doesNeedSave, setDoesNeedSave] = useState<boolean>(false);
  const [containsEmptyField, setContainsEmptyField] = useState<boolean>(false);

  const toggleAccordion = () => {
    const accordion = accordionRef.current;
    const accordionToggler = accordionTogglerRef.current;

    if (!accordion || !accordionToggler || isEditing) return;

    const currentAccordionId: number = celebrityInfo.id;

    if (currentAccordionId === expandedAccordionId) {
      setExpandedAccordionId(null);
    } else if (!isBeingEdited) {
      setExpandedAccordionId(currentAccordionId);
    }
  };

  const showDeleteDialog = () => {
    document.body.style.overflow = 'hidden';
    setShowDelete(true);
  };

  const hideDeleteDialog = () => {
    document.body.style.overflow = 'auto';
    setShowDelete(false);
  };

  const updateAccordion = (
    event: React.FormEvent<HTMLHeadingElement | HTMLSelectElement | HTMLParagraphElement> | React.ChangeEvent<HTMLInputElement>,
    update:string
  ) => {
    switch (update) {
      case 'name': {
        const e = event as React.FormEvent<HTMLHeadingElement>;
        setAccordionName(e.currentTarget.innerText);
        break;
      }
      case 'age': {
        const e = event as React.ChangeEvent<HTMLInputElement>;
        setAccordionAge(parseInt(e.currentTarget.value));
        break;
      }
      case 'gender': {
        const e = event as React.FormEvent<HTMLSelectElement>;
        setAccordionGender(e.currentTarget.value as AccordionData['gender']);
        break;
      }
      case 'country': {
        const e = event as React.ChangeEvent<HTMLInputElement>;
        setAccordionCountry(e.currentTarget.value);
        break;
      }
      case 'description': {
        const e = event as React.FormEvent<HTMLParagraphElement>;
        setAccordionDescription(e.currentTarget.innerText);
        break;
      }
    }
  };

  const handleDelete = () => {
    deleteCelebFromLocal(celebrityInfo.id);
    hideDeleteDialog();
    reloadLocal();
  };

  const handleEdit = () => {
    if (!accordionIsAdult) {
      alert(`${accordionName} is not an adult. Their information can not be edited.`);
      return;
    }

    if (isEditing && accordionDataRef.current) {
      setAccordionName(accordionDataRef.current.name);
      setAccordionAge(accordionDataRef.current.age);
      setAccordionGender(accordionDataRef.current.gender);
      setAccordionCountry(accordionDataRef.current.country);
      setAccordionDescription(accordionDataRef.current.description);
      setAccordionIsAdult(accordionDataRef.current.isAdult);
    }

    setIsBeingEdited(!isEditing);
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (!doesNeedSave || containsEmptyField) return;
    
    const accordionInfo: AccordionData = {
      display: celebrityInfo.picture,
      name: accordionName as string,
      age: accordionAge as number,
      gender: accordionGender as AccordionData['gender'],
      country: accordionCountry as string,
      description: accordionDescription as string,
      isAdult: accordionIsAdult
    }

    const updatedCelebrityInfo: CelebrityInfo | null = createCelebrityData(celebrityInfo.id, accordionInfo);
    if (!updatedCelebrityInfo) {
      setIsBeingEdited(false);
      setIsEditing(false);
      return;
    }

    updateCelebLocal(celebrityInfo.id, updatedCelebrityInfo);

    setIsBeingEdited(false);
    setIsEditing(false);
    reloadLocal();
  };

  useEffect(() => {
    const accordionData: AccordionData = createAccordionData(celebrityInfo)

    setAccordionName(accordionData.name);
    setAccordionAge(accordionData.age);
    setAccordionGender(accordionData.gender);
    setAccordionCountry(accordionData.country);
    setAccordionDescription(accordionData.description);
    setAccordionIsAdult(accordionData.isAdult);
  }, [celebrityInfo]);

  useEffect(() => {
    const accordion = accordionRef.current;
    const accordionToggler = accordionTogglerRef.current;

    if (!accordion || !accordionToggler) return;

    if (celebrityInfo.id === expandedAccordionId) {
      accordion.classList.remove('collapsed');
      accordionToggler.classList.remove('expand');
      accordionToggler.classList.add('collapse');
    } else {
      accordion.classList.add('collapsed');
      accordionToggler.classList.add('expand');
      accordionToggler.classList.remove('collapse');
    }
  }, [expandedAccordionId, celebrityInfo]);

  useEffect(() => {
    if (!isEditing) {
      accordionDataRef.current = null;
      return;
    }

    accordionDataRef.current = {
      display: celebrityInfo.picture,
      name: accordionName ?? '',
      age: accordionAge ?? NaN,
      gender: accordionGender ?? 'rather not say',
      country: accordionCountry ?? '',
      description: accordionDescription ?? '',
      isAdult: accordionIsAdult
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  useEffect(() => {
    if (!accordionDataRef.current) {
      setDoesNeedSave(false);
      return;
    }

    const str1: string = JSON.stringify({
      display: celebrityInfo.picture,
      name: accordionName ?? '',
      age: accordionAge ?? NaN,
      gender: accordionGender ?? 'rather not say',
      country: accordionCountry ?? '',
      description: accordionDescription ?? '',
      isAdult: accordionIsAdult
    });
    const str2: string = JSON.stringify(accordionDataRef.current);

    if (str1 !== str2) {
      setDoesNeedSave(true);
    } else {
      setDoesNeedSave(false);
    }

    let emptyField: boolean = false;
    if (!accordionName?.length) {
      accordionNameRef.current?.classList.add('empty-warn');
      emptyField = true;
    } else {
      accordionNameRef.current?.classList.remove('empty-warn');
    }
    if (accordionAge === null || isNaN(accordionAge) || accordionAge < 0) {
      accordionAgeRef.current?.classList.add('empty-warn');
      emptyField = true;
    } else {
      accordionAgeRef.current?.classList.remove('empty-warn');
    }
    if (!accordionGender?.length) {
      accordionGenderRef.current?.classList.add('empty-warn');
      emptyField = true;
    } else {
      accordionGenderRef.current?.classList.remove('empty-warn');
    }
    if (!accordionCountry?.length) {
      accordionCountryRef.current?.classList.add('empty-warn');
      emptyField = true;
    } else {
      accordionCountryRef.current?.classList.remove('empty-warn');
    }
    if (!accordionDescription?.length) {
      accordionDescriptionRef.current?.classList.add('empty-warn');
      emptyField = true;
    } else {
      accordionDescriptionRef.current?.classList.remove('empty-warn');
    }

    setContainsEmptyField(emptyField);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebrityInfo, accordionName, accordionAge, accordionGender, accordionCountry, accordionDescription, accordionIsAdult]);

  useEffect(() => {
    if (!showDelete || !deleteCelebDialogBgRef.current) return;
    const deleteCelebDialogBg = deleteCelebDialogBgRef.current;

    const handleClick = (event: MouseEvent) => {
      if (deleteCelebDialogRef.current?.contains(event.target as Node)) return;
      hideDeleteDialog();
    };

    deleteCelebDialogBg.removeEventListener('click', handleClick);
    deleteCelebDialogBg.addEventListener('click', handleClick);

    return () => {
      deleteCelebDialogBg.removeEventListener('click', handleClick);
    };
  }, [showDelete]);

  return (
    <section ref={accordionRef} className='accordion collapsed'>
      <section className='acdn-row dp-flex r1'>
        <span className='acdn-col dp-flex'>
          <img src={celebrityInfo.picture} alt={celebrityInfo.picture} />
          <h1
            ref={accordionNameRef}
            contentEditable={isEditing ? 'true' : 'false'}
            className={isEditing ? 'pad borderize newlines' : 'pad'}
            onBlur={(event) => updateAccordion(event, 'name')}
          >
            {`${accordionName}`}
          </h1>
        </span>
        <span className='acdn-col dp-flex-end'>
          <span ref={accordionTogglerRef} className='acdn-toggle expand' onClick={toggleAccordion}></span>
        </span>
      </section>
      <section className='acdn-info'>
        <section className='acdn-row dp-grid c3 r2'>
          <span className='acdn-col'>
            <p>Age</p>
            {
              isEditing ? (
                <input
                  ref={accordionAgeRef}
                  className='borderize age-input'
                  type="number" name="age"
                  value={accordionAge !== null ? accordionAge.toString() : ''}
                  onChange={(event) => updateAccordion(event, 'age')}
                />
              ) : (
                <p className='pad'>{accordionAge}<span> Years</span></p>
              )
            }
          </span>
          <span className='acdn-col'>
            <p>Gender</p>
            {
              isEditing ? (
                <select ref={accordionGenderRef} className='borderize' name='gender' value={accordionGender as string} onChange={(event) => updateAccordion(event, 'gender')}>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='transgender'>Transgender</option>
                  <option value='rather not say'>Rather not say</option>
                  <option value='other'>Other</option>
                </select>
              ) : (
                <p className='pad' style={{textTransform: 'capitalize'}}>{accordionGender}</p>
              )
            }
          </span>
          <span className='acdn-col'>
            <p>Country</p>
            {
              isEditing ? (
                <input
                  ref={accordionCountryRef}
                  className='borderize'
                  type='text'
                  name='country'
                  value={accordionCountry as string}
                  onChange={(event) => updateAccordion(event, 'country')}
                  onKeyDown={(event) => {
                    const isNumber = /^\d$/.test(event.key);
                    if (isNumber) {
                      event.preventDefault();
                    }
                  }}
                />
              ) : (
                <p className='pad'>{accordionCountry}</p>
              )
            }
          </span>
        </section>
        <section className='acdn-row r3'>
          <span className='acdn-col'>
            <p>Description</p>
            <p
              ref={accordionDescriptionRef}
              contentEditable={isEditing ? 'true' : 'false'}
              className={isEditing ? 'pad borderize newlines' : 'pad'}
              onBlur={(event) => updateAccordion(event, 'description')}
            >
              {accordionDescription}
            </p>
          </span>
        </section>
        <section className='acdn-row dp-flex-end r4'>
          {
            isEditing ? (
              <>
                <span className='material-symbols-outlined shiver warn' onClick={handleEdit}>
                  cancel
                </span>
                <span className={`material-symbols-outlined shiver success ${doesNeedSave && !containsEmptyField ? '' : 'disabled'}`} onClick={handleSave}>
                  check_circle
                </span>
              </>
            ) : (
              <>
                <span className='material-symbols-outlined shiver warn' onClick={showDeleteDialog}>
                  delete
                </span>
                <span className='material-symbols-outlined shiver action' onClick={handleEdit}>
                  edit
                </span>
              </>
            )
          }
        </section>
      </section>
      {
        showDelete && (
          <div ref={deleteCelebDialogBgRef} className='dialog-bg'>
            <span ref={deleteCelebDialogRef} id='deleteCelebDialog' className='dialog-box'>
              <span>
                <p>Are you sure you want to delete?</p>
                <span className='material-symbols-outlined shiver secondary' onClick={hideDeleteDialog}>
                  close
                </span>
              </span>
              <span>
                <button className='shiver' onClick={hideDeleteDialog}>Cancel</button>
                <button className='shiver warn-bg' onClick={handleDelete}>Delete</button>
              </span>
            </span>
          </div>
        )
      }
    </section>
  );
};

export default Accordion;
